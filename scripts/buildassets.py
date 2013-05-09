#!/usr/bin/env python
# Copyright (c) 2013 Turbulenz Limited

from sys import argv, stdout
from json import loads as load_json, dumps as dump_json
from yaml import load as load_yaml
from os.path import join as path_join, exists as path_exists, splitext, basename, normpath, getmtime
from os import makedirs, listdir, unlink as remove_file, getenv as os_getenv
from shutil import copy2 as copy_file
from hashlib import md5
from base64 import urlsafe_b64encode
from subprocess import Popen, PIPE, STDOUT
from platform import system, machine
import argparse

import platform
COLORED_OUTPUT = stdout.isatty() and platform.system() != 'Windows'

def warning(message):
    if COLORED_OUTPUT:
        print '\033[1m\033[33m[WARNING]\033[0m - %s' % message
    else:
        print '[WARNING] - %s' % message

def error(message):
    if COLORED_OUTPUT:
        print ' >> \033[31m[ERROR]\033[0m   - %s' % message
    else:
        print ' >> [ERROR]   - %s' % message

# pylint: disable=W0231
class CalledProcessError(Exception):
    def __init__(self, retcode, cmd, output=None):
        self.retcode = retcode
        self.cmd = cmd
        self.output = output
    def __str__(self):
        cmd = self.cmd
        if isinstance(cmd, list):
            cmd = ' '.join(cmd)
        return "Command '%s' returned non-zero exit status %d" % (cmd, self.retcode)
# pylint: enable=W0231

# pylint: disable=C0103
def sh(command, cwd=None, env=None, verbose=True, console=False, shell=False):
    command_list = command
    command_string = ' '.join(command)

    if verbose:
        print 'Executing: %s' % command_string

    try:
        if console:
            process = Popen(command_list, stderr=STDOUT, cwd=cwd, shell=shell, env=env)
        else:
            process = Popen(command_list, stdout=PIPE, stderr=STDOUT, cwd=cwd, shell=shell, env=env)
    except OSError:
        raise CalledProcessError(1, command_list, output='Could not start process')
    output, _ = process.communicate()
    output = str(output)
    retcode = process.poll()
    if retcode:
        raise CalledProcessError(retcode, command_list, output=output)

    if output is not None:
        output = output.rstrip()

    return output
# pylint: enable=C0103

def get_file_hash(path):
    with open(path, 'r') as f:
        m = md5()
        m.update(f.read())
    digest = m.digest()
    return urlsafe_b64encode(digest).rstrip('=')

class Source():
    def __init__(self, path, assets_paths, old_hash=None):
        self.path = path
        for p in assets_paths:
            self.asset_path = path_join(p, path)
            if path_exists(self.asset_path):
                break
        else:
            raise IOError('Source asset path not found for %s' % self.path)
        if old_hash:
            self.hash = old_hash
            self.hash_checked = False
            self.changed = None
        else:
            self.hash = self.calculate_hash()
            self.hash_checked = True
            self.changed = True

    def has_changed(self):
        if self.hash_checked:
            return self.changed
        else:
            new_hash = self.calculate_hash()
            self.changed = (new_hash != self.hash)
            self.hash = new_hash
            self.hash_checked = True
            return self.changed

    def calculate_hash(self):
        return get_file_hash(self.asset_path)

class SourceList():
    def __init__(self, source_hashes, assets_paths):
        self.assets_paths = assets_paths
        source_list = {}
        for (path, file_hash) in source_hashes.iteritems():
            source_list[path] = Source(path, assets_paths, file_hash)

        self.source_list = source_list

    def get_source(self, path):
        if path not in self.source_list:
            self.source_list[path] = Source(path, self.assets_paths)

        return self.source_list[path]

    def get_hashes(self):
        return dict((k, v.hash) for (k, v) in self.source_list.iteritems() if v.hash_checked)

class Tool(object):
    def __init__(self, name, path):
        super(Tool, self).__init__()
        self.name = name
        self.path = path
        self.changed = None

    def check_version(self, build_path, verbose=False):
        version_file_path = path_join(build_path, self.name + '.version')
        try:
            with open(version_file_path, 'rt') as f:
                old_version = f.read()
        except IOError:
            old_version = None

        version = self.get_version(version_file_path)
        self.changed = (version != old_version)
        if self.changed and verbose:
            print self.name + ' tool version changed ' + version
        return self.changed

    def get_version(self, version_file_path):
        raise NotImplementedError()

    def has_changed(self):
        if self.changed is None:
            raise ValueError('Tool %s has not called check_version' % self.name)
        else:
            return self.changed

    @staticmethod
    def run_sh(cmd, verbose):
        try:
            sh(cmd, verbose=verbose)
            return True
        except CalledProcessError as e:
            error('command %s failed\n%s' % (' '.join(e.cmd), e.output))
            raise

# pylint: disable=R0201
    def check_external_deps(self, src, dst, args):
        return False
# pylint: enable=R0201

class CopyTool(object):
    def __init__(self, name='copy', path=None):
        self.name = name

    @staticmethod
    def run(src, dst, verbose=False, args=None):
        if verbose:
            print 'Copy ' + src + ' -> ' + dst
        copy_file(src, dst)
        return True

    @staticmethod
    def check_version(build_path, verbose=False):
        return False

    @staticmethod
    def has_changed():
        return False

    @staticmethod
    def check_external_deps(src, dst, args):
        return False

class Tga2Json(Tool):
    def get_version(self, version_file_path):
        try:
            version_string = sh([self.path, '--version'], verbose=False)
        except CalledProcessError:
            warning('could not launch ImageMagick, TGA support will not be available')
            return None
        version = version_string.splitlines()[0]
        with open(version_file_path, 'wt') as f:
            f.write(version)
        return version

    def run(self, src, dst, verbose=False, args=None):
        cmd = [self.path, '-quality', '105', src, dst]
        if args:
            cmd.extend(args)
        return self.run_sh(cmd, verbose=verbose)

class PythonTool(Tool):
    def __init__(self, name, path=None, module_name=None):
        if module_name:
            self.base_args = ['python', '-m', module_name]
        else:
            self.base_args = ['python', self.path]
        super(PythonTool, self).__init__(name, path)

    def get_version(self, version_file_path):
        cmd = self.base_args[:]
        cmd.extend(['--version', '-o', version_file_path])
        return sh(cmd, verbose=False)

    def run(self, src, dst, verbose=False, args=None):
        cmd = self.base_args[:]
        cmd.extend(['-i', src, '-o', dst])
        if args:
            cmd.extend(args)
        return self.run_sh(cmd, verbose=verbose)

class Dae2Json(PythonTool):
    def __init__(self, name, path=None, module_name=None, nvtristrip=None):
        super(Dae2Json, self).__init__(name, path, module_name)
        self.nvtristrip = nvtristrip

    def get_version(self, version_file_path):
        cmd = self.base_args[:]
        cmd.extend(['--version', '-o', version_file_path])
        return sh(cmd, verbose=False)

    def run(self, src, dst, verbose=False, args=None):
        cmd = self.base_args[:]
        cmd.extend(['-i', src, '-o', dst])
        if self.nvtristrip:
            cmd.extend(['--nvtristrip', self.nvtristrip])
        if args:
            cmd.extend(args)
        return self.run_sh(cmd, verbose=verbose)

class Cgfx2JsonTool(Tool):
    def get_version(self, version_file_path):
        try:
            version = sh([self.path, '--version'], verbose=False)
        except CalledProcessError:
            error('could not launch cgfx2json, CGFX support will be unavailable.')
            return None
        with open(version_file_path, 'wt') as f:
            f.write(version)
        return version

    def run(self, src, dst, verbose=False, args=None):
        cmd = [self.path, '-i', src, '-o', dst]
        if args:
            cmd.extend(args)
        return self.run_sh(cmd, verbose=verbose)

    def check_external_deps(self, src, dst, args):
        cmd = [self.path, '-i', src, '-M']
        try:
            dep_files = sh(cmd, verbose=False)
        except CalledProcessError as e:
            error('deps command %s failed ignoring external deps\n%s' % (' '.join(e.cmd), e.output))
            return False
        if not dep_files:
            return False
        dst_mtime = getmtime(dst)
        for filename in dep_files.replace('\r\n', '\n').split('\n'):
            if getmtime(filename) > dst_mtime:
                return True


class Tools(object):
    def __init__(self, args, build_path):
        exe = ''
        system_name = system()
        if system_name == 'Linux':
            if 'x86_64' == machine():
                turbulenz_os = 'linux64'
            else:
                turbulenz_os = 'linux32'
        elif system_name == 'Windows':
            turbulenz_os = 'win32'
            # if 'x86' == machine():
            #     turbulenz_os = 'win32'
            # else:
            #     turbulenz_os = 'win64'
            exe = '.exe'
        elif system_name == 'Darwin':
            turbulenz_os = 'macosx'

        root = args.root
        verbose = args.verbose

        if args.imagemagick_convert:
            imagemagick_convert_path = args.imagemagick_convert
        else:
            if system_name == 'Windows':
                default_convert_path = path_join(root, 'external', 'ImageMagick', 'bin', 'win32', 'convert.exe')
            else:
                default_convert_path = 'convert'
            imagemagick_convert_path = os_getenv('TURBULENZ_IMAGEMAGICK_CONVERT', default_convert_path)

        nvtristrip = path_join(root, 'external', 'NvTriStrip', 'bin', turbulenz_os, 'NvTriStripper' + exe)

        copy = CopyTool()
        tga2png = Tga2Json('tga2png', imagemagick_convert_path)
        dae2json = Dae2Json('dae2json', module_name='turbulenz_tools.tools.dae2json', nvtristrip=nvtristrip)
        obj2json = PythonTool('obj2json', module_name='turbulenz_tools.tools.obj2json')
        material2json = PythonTool('material2json', module_name='turbulenz_tools.tools.material2json')
        bmfont2json = PythonTool('bmfont2json', module_name='turbulenz_tools.tools.bmfont2json')
        cgfx2json = Cgfx2JsonTool('cgfx2json', path_join(root, 'tools', 'bin', turbulenz_os, 'cgfx2json' + exe))

        copy.check_version(build_path, verbose)
        tga2png.check_version(build_path, verbose)
        dae2json.check_version(build_path, verbose)
        obj2json.check_version(build_path, verbose)
        material2json.check_version(build_path, verbose)
        bmfont2json.check_version(build_path, verbose)
        cgfx2json.check_version(build_path, verbose)


        self.asset_tool_map = {
            '.png': copy,
            '.dds': copy,
            '.jpg': copy,
            '.ogg': copy,
            '.wav': copy,
            '.mp3': copy,
            '.mp4': copy,
            '.webm': copy,
            '.tga': tga2png,
            '.dae': dae2json,
            '.obj': obj2json,
            '.material': material2json,
            '.bmfont': bmfont2json,
            '.fnt': bmfont2json,
            '.cgfx': cgfx2json
        }

        self.asset_dst_ext = {
            '.dae': '.dae.json',
            '.obj': '.obj.json',
            '.material': '.material.json',
            '.fnt': '.fnt.json',
            '.cgfx': '.cgfx.json',
            '.tga': '.tga.png'
        }

    def get_asset_tool(self, path):
        ext = splitext(path)[1]
        try:
            return self.asset_tool_map[ext]
        except KeyError:
            error('No tool registered for file extension %s' % ext)
            exit(1)

    def get_asset_destination(self, path):
        path_split = splitext(path)
        try:
            return path_split[0] + self.asset_dst_ext[path_split[1]]
        except KeyError:
            return path


class AssetInfo(object):
    def __init__(self, yaml_info):
        if isinstance(yaml_info, str):
            path = normpath(yaml_info)
            self.path = path
            self.deps = [path]
            self.install = True
            self.args = None
            self.logical_path = yaml_info
        else:
            self.path = normpath(yaml_info['path'])
            deps = yaml_info.get('deps', [])
            self.deps = [ normpath(d) for d in deps ]
            self.deps.append(self.path)
            self.install = yaml_info.get('install', True)
            self.args = yaml_info.get('args')
            self.logical_path = yaml_info.get('logical_path', yaml_info['path'])

        self.build_path = None


def build_asset(asset_info, source_list, tools, build_path, verbose):
    src = asset_info.path

    asset_tool = tools.get_asset_tool(src)
    dst_path = path_join(build_path, tools.get_asset_destination(src))
    asset_info.build_path = dst_path

    source = source_list.get_source(src)
    deps = [ source_list.get_source(path) for path in asset_info.deps ]
    if any([dep.has_changed() for dep in deps]) or asset_tool.has_changed() or not path_exists(dst_path) \
            or asset_tool.check_external_deps(source.asset_path, dst_path, asset_info.args):
        print '[%s] %s' % (asset_tool.name.upper(), src)
        asset_tool.run(source.asset_path, dst_path, verbose, asset_info.args)
        return True
    else:
        return False

def install(install_asset_info, install_path):
    old_install_files = listdir(install_path)
    mapping = {}

    for asset_info in install_asset_info:
        if not asset_info.install:
            continue
        try:
            file_hash = get_file_hash(asset_info.build_path)
            logical_path = asset_info.logical_path
            physical_path = '%s_%s.%s' % (splitext(basename(logical_path))[0],
                                          file_hash,
                                          asset_info.build_path.split('.', 1)[1])

            copy_file(asset_info.build_path, path_join(install_path, physical_path))
            mapping[logical_path] = physical_path

            try:
                old_install_files.remove(physical_path)
            except ValueError:
                pass

        except (IOError, TypeError):
            error('could not install %s' % asset_info.path)

    for path in old_install_files:
        asset_install_path = path_join(install_path, path)
        print 'Removing old install file ' + asset_install_path
        remove_file(asset_install_path)

    return mapping

def remove_old_build_files(build_asset_info, build_paths):
    old_build_files = []
    for path in build_paths:
        old_build_files.extend(path_join(path, filename) for filename in listdir(path))

    for asset_info in build_asset_info:
        try:
            old_build_files.remove(asset_info.build_path)
        except ValueError:
            pass

    for path in old_build_files:
        print 'Removing old build file ' + path
        remove_file(path)

def create_dir(path):
    if path_exists(path) is False:
        try:
            makedirs(path)
        except IOError as e:
            print("Failed creating: %s" % str(e))
        else:
            print("Created: %s" % path)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True, help="Root path of Turbulenz Engine")
    parser.add_argument('--assets-path', required=True, action='append', help="Path to root of source assets")
    parser.add_argument('--build-path', default=path_join('_build', 'assets'), help="Path for intermediate build files")
    parser.add_argument('--install-path', default='staticmax', help="Path to install output assets into")
    parser.add_argument('--verbose', action='store_true')
    parser.add_argument('--imagemagick-convert', help="Path to ImageMagick convert executable (enables TGA support)")

    args = parser.parse_args(argv[1:])

    assets_paths = [ normpath(p) for p in args.assets_path ]
    base_build_path = normpath(args.build_path)
    build_paths = [
        path_join(base_build_path, 'textures'),
        path_join(base_build_path, 'models'),
        path_join(base_build_path, 'sounds'),
        path_join(base_build_path, 'materials'),
        path_join(base_build_path, 'shaders'),
        path_join(base_build_path, 'fonts'),
        path_join(base_build_path, 'videos'),
    ]
    create_dir(base_build_path)
    for path in build_paths:
        create_dir(path)

    create_dir(args.install_path)

    tools = Tools(args, base_build_path)

    with open('deps.yaml', 'rt') as f:
        asset_build_info = load_yaml(f.read())
        if asset_build_info:
            asset_build_info = [AssetInfo(asset_info) for asset_info in asset_build_info]
        else:
            asset_build_info = []

    try:
        with open(path_join(base_build_path, 'sourcehashes.json'), 'rt') as f:
            source_list = SourceList(load_json(f.read()), assets_paths)
    except IOError:
        if args.verbose:
            print 'No source hash file'
        source_list = SourceList({}, assets_paths)

    try:
        assets_rebuilt = 0
        for asset_info in asset_build_info:
            rebuild = build_asset(asset_info, source_list, tools, base_build_path, args.verbose)
            if rebuild:
                assets_rebuilt += 1
    except CalledProcessError as e:
        error('Tool failed - %s' % str(e))
        return 1
    except IOError as e:
        error(str(e))

    with open(path_join(base_build_path, 'sourcehashes.json'), 'wt') as f:
        f.write(dump_json(source_list.get_hashes()))

    print 'Installing assets and building mapping table...'
    mapping = install(asset_build_info, args.install_path)

    with open('mapping_table.json', 'wt') as f:
        f.write(dump_json({
                'urnmapping': mapping
            }))

    remove_old_build_files(asset_build_info, build_paths)

    print '%d assets rebuilt' % assets_rebuilt
    print 'Assets build complete'

if __name__ == "__main__":
    exit(main())
