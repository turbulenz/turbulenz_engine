#!/usr/bin/env python
# Copyright (c) 2011-2013 Turbulenz Limited

"""
Init script for manipulating the Turbulenz Engine project.
"""
import os
import sys
import re
import time
import os.path
from glob import iglob
from subprocess import call
import argparse

from scripts import TURBULENZ_ENGINE_VERSION
from scripts.utils import TURBULENZOS, TURBULENZROOT, PYTHON, ENV
from scripts.utils import command_no_arguments, command_with_arguments, command_requires_env
from scripts.utils import CalledProcessError, echo, log, warning, error, ok, sh, rmdir, find_devenv
from scripts.utils import check_documentation_links

import distutils.util
import errno

import yaml

#######################################################################################################################


@command_requires_env
@command_with_arguments
def command_protolib_init(options):

    app_dirs = ['assets',
                'assets/models',
                'assets/textures',
                'assets/shaders',
                'assets/fonts',
                'assets/sounds',
                'css',
                'img',
                'js',
                'templates',
                'scripts']

    app_yaml = ['deps.yaml',
                'manifest.yaml']

    def mkdir_p(path):
        try:
            os.makedirs(path)
        except OSError as exc: # Python >2.5
            if exc.errno == errno.EEXIST and os.path.isdir(path):
                pass
            else: raise

    def _choice(msg):
        result = None
        while result is None:
            try:
                input = raw_input('%s [y/n]' % msg)
                result = distutils.util.strtobool(input)
            except ValueError, e:
                result = None
        return result

    def _generate_dirs(root, dummy=False):

        app_full_dirs = []
        for d in app_dirs:
            app_full_dirs.append(os.path.normpath(os.path.join(root, d)))

        for d in app_full_dirs:
            log("Creating %s" % d)
            if not dummy:
                mkdir_p(d)

    def _remove_empty_dirs(dir, dummy=False):
        if not os.path.isdir(dir):
            return True

        files = os.listdir(dir)
        if len(files):
            for f in files:
                fullpath = os.path.join(dir, f)
                if os.path.isdir(fullpath):
                    _remove_empty_dirs(fullpath, dummy)

        files = os.listdir(dir)
        if len(files) == 0:
            log("Removing: %s" % dir)
            if not dummy:
                try:
                    os.rmdir(dir)
                    return True
                except OSError as e:
                    warning("%s" % e)
        return False

    def _remove_dirs(root, dummy=False):

        remove_success = True

        app_full_dirs = []
        for d in app_dirs:
            app_full_dirs.append(os.path.normpath(os.path.join(root, d)))

        for d in app_full_dirs:
            log("Cleaning %s" % d)
            if not _remove_empty_dirs(d, dummy):
                remove_success = False

        return remove_success

    def _generate_yaml_manifest(filepath, args, root=None, dummy=False):

        log('manifest.yaml: Generating data')

        appname = args.app
        engine_version = args.engine_version
        title = args.title

        if appname is None:
            warning('manifest.yaml: Missing appname')
            return False

        if engine_version is None:
            warning('manifest.yaml: Missing engine_version')
            return False

        if root is None:
            warning('manifest.yaml: Missing root')
            return False

        if title is None:
            title = appname

        if 'canvas' in args.mode or 'all' in args.mode:
            canvas_main = '%s.canvas.js' % appname
        else:
            canvas_main = ''

        if 'plugin' in args.mode or 'all' in args.mode:
            plugin_main = '%s.tzjs' % appname
        else:
            plugin_main = ''

        deploy_files = [plugin_main,
                        canvas_main,
                        'mapping_table.json',
                        'staticmax/*']

        manifest_data = {
            'aspect_ratio': '16:9',
            'canvas_main': canvas_main,
            'cover_art': 'cover_art.png',
            'deploy_files': deploy_files,
            'deployed': 'Never',
            'engine_version': engine_version,
            'flash_main': '',
            'is_multiplayer': 'false',
            'is_temp': 'false',
            'mapping_table': 'mapping_table.json',
            'modified': 'Never',
            'path': root,
            'plugin_main': plugin_main,
            'slug': appname,
            'title': title,
            'title_logo': ''
        }

        if not os.path.exists(filepath) or args.force:
            log('manifest.yaml: Writing\n%r' % manifest_data)
            if not dummy:
                f = open(filepath, 'w')
                yaml.dump(manifest_data, f, default_flow_style=False)
                f.close()
        else:
            warning('manifest.yaml exists: %s' % filepath)
            return False

        return True

    def _generate_yaml_canvasdeps(filepath, args, dummy=False):

        appname = args.app
        canvasdeps_data = {}
        canvasdeps_data[appname] = None

        if os.path.exists(filepath):
            f = open(filepath, 'r')
            canvasdeps = yaml.load(f)
            print canvasdeps
            f.close()

        if not os.path.exists(filepath) or args.force:
            log('canvasdeps.yaml: Writing\n%r' % canvasdeps_data)
            if not dummy:
                f = open(filepath, 'w')
                yaml.dump(canvasdeps_data, f, default_flow_style=False)
                f.close()
        else:
            warning('canvasdeps.yaml exists: %s' % filepath)
            return False

        return True

    def _generate_yaml_deps(filepath, args, dummy=False):

        deps_header = ['# Syntax:',
                        '#',
                        '# Either:',
                        '# - assetpath',
                        '#',
                        '# or:',
                        '# - path: path to input asset',
                        '# - logical_path: [Optional] Change the logical mapping table name (defaults to path)',
                        '# - install: [Optional] copy the built asset to staticmax (defaults to true)',
                        '# - deps: [Optional] extra definitions that the build tool requires',
                        '# - args: [Optional] extra arguments for the build tool]']
        deps_data = [
            'shaders/debug.cgfx',
            'shaders/shadowmapping.cgfx',
            'shaders/zonly.cgfx',
            'shaders/font.cgfx',
            'shaders/forwardrendering.cgfx',
            'shaders/forwardrenderingshadows.cgfx',
            'shaders/simplesprite.cgfx',
            'textures/default_light.png',
            'textures/opensans-8_0.png',
            'textures/opensans-16_0.png',
            'textures/opensans-32_0.png',
            'textures/opensans-64_0.png',
            'textures/opensans-128_0.png',
            'fonts/opensans-8.fnt',
            'fonts/opensans-16.fnt',
            'fonts/opensans-32.fnt',
            'fonts/opensans-64.fnt',
            'fonts/opensans-128.fnt'
        ]

        if args.template[0] == 'protolibsampleapp':
            deps_data.extend([
                'textures/tz-logo.png',
                'textures/dot.png',
                'textures/sound.png',
                'textures/cursor.png',
                'textures/blade.png',
                'textures/white.png',
                'textures/cross.png',
                'sounds/bgmusic_loop.ogg',
                'models/tz_logo.dae',
                'models/white_cube.dae'
            ])

        if not os.path.exists(filepath) or args.force:
            log('deps.yaml: Writing\n%r' % deps_data)
            if not dummy:
                f = open(filepath, 'w')
                for line in deps_header:
                    f.write("%s\n" % line)
                if deps_data:
                    yaml.dump(deps_data, f, default_flow_style=False)
                f.close()
        else:
            warning('deps.yaml exists: %s' % filepath)
            return False

        return True

    def _generate_yaml(root, args, dummy=False):

        app_full_yaml = []
        for y in app_yaml:
            app_full_yaml.append(os.path.normpath(os.path.join(root, y)))

        if 'canvas' in args.mode or 'canvas-debug' in args.mode or 'all' in args.mode:
            app_full_yaml.append(os.path.normpath(os.path.join(root, 'canvasdeps.yaml')))

        for y in app_full_yaml:
            log("Creating %s" % y)
            filename = os.path.split(y)[1]
            if filename == 'manifest.yaml':
                _generate_yaml_manifest(y, args, root=root)
            elif filename == 'canvasdeps.yaml':
                _generate_yaml_canvasdeps(y, args)
            elif filename == 'deps.yaml':
                _generate_yaml_deps(y, args)
            else:
                if not dummy:
                    open(y, 'a').close()

    def _remove_yaml(root, args, dummy=False):

        remove_success = True
        app_full_yaml = []
        for y in app_yaml:
            app_full_yaml.append(os.path.normpath(os.path.join(root, y)))

        if 'canvas' in args.mode or 'canvas-debug' in args.mode or 'all' in args.mode:
            app_full_yaml.append(os.path.normpath(os.path.join(root, 'canvasdeps.yaml')))

        for y in app_full_yaml:
            if os.path.exists(y):
                log("Removing %s" % y)
                if not dummy:
                    try:
                        os.remove(y)
                    except OSError as e:
                        warning("%s" % e)
                        remove_success = False

        return remove_success

    def _generate_makefile(filepath, args, dummy=False):

        relpath = os.path.relpath(os.path.normpath(TURBULENZROOT), os.path.normpath(args.dir))
        makefile_data = ['# Location of the Turbulenz checkout root',
                        'TZROOT := %s' % relpath,
                        '',
                        '# Location of templates.  Each .js file in the templates dir',
                        '# represents an application to be built',
                        'TEMPLATES_DIR := templates',
                        '',
                        '# Other directories from which code may be included',
                        'INCLUDE_DIRS := .',
                        '',
                        '# Apps that do not have a canvas version',
                        'NON_CANVAS_APPS :=',
                        '',
                        '# include the main application build file',
                        'include $(TZROOT)/scripts/appbuild.mk']

        if not os.path.exists(filepath) or args.force:
            log('Makefile: Writing\n%r' % makefile_data)
            if not dummy:
                f = open(filepath, 'w')
                for line in makefile_data:
                    f.write("%s\n" % line)
                f.close()
        else:
            warning('Makefile exists: %s' % filepath)
            return False

        return True

    def _remove_makefile(filepath, args, dummy=False):
        if os.path.exists(filepath):
            log('Removing: %s' % filepath)
            if not dummy:
                try:
                    os.remove(filepath)
                except OSError as e:
                    warning("%s" % e)
                    return False
        return True

    parser = argparse.ArgumentParser(description=" Initializes a protolib app, generating the files required "
                                                 " such as build files, directory structure, protolib, etc.")
    parser.add_argument('--clean', action='store_true', help="Clean specified apps (same as apps-clean)")
    parser.add_argument('--verbose', action='store_true', help="Display verbose build output")
    parser.add_argument('--mode', action='append', help="Add build mode (default canvas & canvas-debug)",
                        choices=['all', 'plugin', 'plugin-debug', 'canvas', 'canvas-debug'])
    parser.add_argument('--dir', default=os.getcwd(), action='store', help="Directory to initialize the app")
    parser.add_argument('--engine-version', default=TURBULENZ_ENGINE_VERSION, action='store', help="Engine version to build against")
    parser.add_argument('--title', action='store', help="The title of the app (Use by the local server)")
    parser.add_argument('--force', action='store_true', help="Overwrite existing configuration files")
    parser.add_argument('--template', nargs=1, action='store', help="The template to use for generation",
                        choices=['protolibskeletonapp', 'protolibsampleapp'])
    parser.add_argument('app', default='app', nargs='?', help="Select an individual app to build")

    args = parser.parse_args(options)

    log('app: %r' % args.app)
    log('clean: %r' % args.clean)
    log('verbose: %r' % args.verbose)
    log('dir: %r' % args.dir)
    log('mode: %r' % args.mode)
    log('title: %r' % args.title)
    log('engine_version: %r' % args.engine_version)
    log('force: %r' % args.force)
    log('template: %r' % args.template)

    if args.dir is None:
        error('Dir is None')
        return
    else:
        if not os.path.exists(args.dir):
            error('Dir does not exist: %r: ' % args.dir)
            return

    if args.mode is None:
        args.mode = ['canvas', 'canvas-debug']

    if args.template is None:
        args.template = ['protolibskeleton']

    if args.clean:
        if not _choice('Clean directory: %s\n Is this correct?' % (args.dir)):
            error('Failed to clean')
            return

        command_protolib_build(["protolib-build", "--clean", "--dir", args.dir])

        remove_success = True

        if not _remove_dirs(args.dir):
            remove_success = False

        if not _remove_yaml(args.dir, args):
            remove_success = False

        if not _remove_makefile(os.path.normpath(os.path.join(args.dir, 'Makefile')), args):
            remove_success = False

        if not remove_success:
            warning("Not all files were successfully removed")

    if not _choice('Create "%s" in directory: %s\n Is this correct?' % (args.app, args.dir)):
        error('Failed to create')
        return

    _generate_dirs(args.dir)

    _generate_yaml(args.dir, args)

    _generate_makefile(os.path.normpath(os.path.join(args.dir, 'Makefile')), args)

    return

@command_requires_env
@command_with_arguments
def command_protolib_build(options):

    parser = argparse.ArgumentParser(description=" Initializes a protolib app, generating the files required "
                                                 " such as build files, directory structure, protolib, etc.")
    parser.add_argument('--clean', action='store_true', help="Clean the app")
    parser.add_argument('--no-copy', action='store_true', help="Don't attempt to copy protolib")
    parser.add_argument('--verbose', action='store_true', help="Display verbose build output")
    parser.add_argument('--dir', action='store', help="Directory to build the app")
    parser.add_argument('app', default='app', nargs='?', help="Select an individual app to build")

    args = parser.parse_args(options)

    if args.dir is None:
        args.dir = os.path.normpath(os.path.join("apps", args.app))

    try:
        if args.clean:
            sh("python manage.py apps-clean " + args.dir,  console=args.verbose, shell=True)
            protolib_dir = os.path.abspath(os.path.normpath(os.path.join(args.dir, 'protolib')))
            if os.path.isdir(protolib_dir):
                try:
                    os.rmdir(protolib_dir)
                except OSError as e:
                    warning("%s" % e)
        else:
            if not args.no_copy:
                sh(os.path.join(os.getcwd(), "external", "gnumake-win32", "3.81", "bin", "make") + " do_install_protolib", cwd=args.dir,  console=args.verbose, shell=True)
            sh("python manage.py apps " + args.dir + " --assets-path " + os.path.abspath(os.path.join(args.dir, "assets")),  console=args.verbose, shell=True)

    except CalledProcessError as e:
        error("Command: %s" % e.cmd)
        if e.output is not None:
            error("Output: %r" % e.output)
        error("Retcode: %r" % e.retcode)

#######################################################################################################################


def command_help(commands):
    echo('Usage')
    echo('=====')
    echo('  %s command [options]\n' % sys.argv[0])

    for title, group in commands.iteritems():
        echo('%s commands:' % title)
        echo((len(title) + 10) * '-')
        for command, (_, help_txt) in iter(sorted(group.iteritems())):
            if len(command) > 24:
                padding = '\n%s' % (' ' * 26)
            else:
                padding = ' ' * (24 - len(command))

            echo('  %s%s%s' % (command, padding, help_txt))
        else:
            echo()
    return 1

def main():
    commands = {
        'Application building': {
            'protolib-init': (command_protolib_init, "Initialize a new protolib app (-h for options)"),
            'protolib-build': (command_protolib_build, "Build a protolib app (-h for options)")
        }
    }

    if len(sys.argv) == 1:
        command_help(commands)
        return 1

    command = sys.argv[1]
    options = sys.argv[2:]

    for command_group in commands.itervalues():
        try:
            command_fn, _ = command_group[command]
        except KeyError:
            pass
        else:
            try:
                return command_fn(options)
            except CalledProcessError as e:
                error(str(e))
                return e.retcode
            except OSError as e:
                error(str(e))
                return e.errno
            except KeyboardInterrupt as e:
                error(str(e))
            return 1

    if command == '--list-commands':
        for command_group in commands.itervalues():
            for command in command_group.iterkeys():
                echo(command)
        return 0

    command_help(commands)
    return 1

if __name__ == '__main__':
    main()
