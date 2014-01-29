#!/usr/bin/env python
# Copyright (c) 2011-2012 Turbulenz Limited

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
from scripts.utils import CalledProcessError, echo, log, warning, error, ok, sh, rmdir, rm, mkdir, cp
from scripts.utils import check_documentation_links, find_devenv, check_compilers

#######################################################################################################################

@command_no_arguments
def command_env():
    if sys.version_info[1] != 7:
        error('Turbulenz requires python 2.7')
        return -1

    env_dir = os.path.join(TURBULENZROOT, ENV)
    if not os.path.isdir(env_dir):
        if TURBULENZOS == 'win32':
            sh('%s -m virtualenv --no-site-packages %s' % (sys.executable, env_dir))
        else:
            print "PYTHON: %s" % PYTHON
            cmd = 'virtualenv -p %s --no-site-packages %s' % (PYTHON, env_dir)
            print "CMD: %s" % cmd
            sh(cmd, console=True)

    if TURBULENZOS == 'win32':
        env_bin = os.path.join(TURBULENZROOT, 'env', 'scripts')
        activate_script = os.path.join(env_bin, 'activate.bat')
        extra_path = 'set PATH=%PATH%;%VIRTUAL_ENV%\\..\\tools\\scripts\n'
    else:
        env_bin = os.path.join(TURBULENZROOT, 'env', 'bin')
        activate_script = os.path.join(env_bin, 'activate')
        extra_path = 'export PATH=$PATH:$VIRTUAL_ENV/../tools/scripts\n'

    with open(activate_script, 'r+') as f:
        activate_text = f.read()
        if activate_text.find(extra_path) == -1:
            # Seek is required here on Windows Python 2.x
            f.seek(0, 2)
            f.write(extra_path)

    try:
        check_compilers()
    except EnvironmentError as e:
        error(e)
        exit(1)

    def _easy_install(package):
        cmd = [os.path.join(env_bin, 'easy_install'), '-Z', package]
        sh(cmd)

    _easy_install('simplejson>=2.1.5')
    _easy_install('PyYAML>=3.10')

    _easy_install('logilab-common==0.60.0')
    _easy_install('pylint==1.0.0')

    _easy_install('roman>=1.4.0')
    _easy_install('docutils>=0.9.1')
    _easy_install('Sphinx>=1.1.3')

    _easy_install('turbulenz_tools>=1.0.4')
    _easy_install('turbulenz_local>=1.1.3')

    cmd = [os.path.join(env_bin, 'python'),
           os.path.join(TURBULENZROOT, 'scripts', 'install_nodejs.py'),
           '--prefix', env_dir,
           '--typescript']
    if not TURBULENZOS in [ 'linux32', 'linux64' ]:
        cmd.append('-f')
    sh(cmd, console=True)

@command_no_arguments
def command_env_clean():
    rmdir(os.path.join(TURBULENZROOT, ENV))

#######################################################################################################################

@command_requires_env
@command_with_arguments
def command_jslib(options):

    parser = argparse.ArgumentParser(description=" Builds or cleans specified app(s), by name or path. If no app is"
                                                 " given, builds or cleans all the listed apps (except samples).")
    parser.add_argument('--clean', action='store_true', help="Clean jslib (completely removes directory!)")
    parser.add_argument('--outdir', default=None, help="Build jslib to an alternative directory")
    parser.add_argument('--closure', action='store_true', help="Verify the generated .js files with closure")
    parser.add_argument('-v', '--verbose', action='store_true', help="Verbose output")
    parser.add_argument('-j', type=int, default=_get_num_cpus() + 1, help="Up to N processes (default is num CPUS + 1)")
    parser.add_argument('--check', help="Syntax check the given file under tslib")
    parser.add_argument('--refcheck', action='store_true', help="Enable the reference checking build")
    parser.add_argument('-m', '--modular', action='store_true', help="Build modules only (in dependency order)")
    parser.add_argument('--crude', action='store_true', help="Build jslib only (no error checking)")

    args = parser.parse_args(options)

    if args.modular:
        mode = 'modular'
    elif args.crude:
        mode = 'crude'
    else:
        mode = 'all'

    # Clean any make env vars in case we have been invoked from a
    # parent make process.
    os.environ['MAKEFLAGS'] = ""
    os.environ['MFLAGS'] = ""

    # Determine the make command line
    cmd = "%s -j %s" % (_get_make_command(), args.j)

    # Explicitly run make in the root of the engine folder
    cmd += ' -C %s' % TURBULENZROOT

    if args.outdir:
        cmd += " TZ_OUTPUT_DIR=%s" % args.outdir
    if args.verbose:
        cmd += " CMDVERBOSE=1"
    if args.closure:
        cmd += " VERIFY_CLOSURE=1"

    # If mode == "all", run the modular build, then crude
    if "all" == mode:
        if 0 != command_jslib(options + [ '--modular' ]):
            return 1
        mode = "crude"
    elif "modular" == mode:
        cmd += " MODULAR=1"
    elif "refcheck" == mode:
        cmd += " REFCHECK=1"

    # Select the appropriate target based on whether we are syntax
    # checking or doing a full build.
    if args.check:
        cmd += " CHK_SOURCES=%s SYNTAX_CHECK_MODE=1 REFCHECK=1 check-syntax" \
            % args.check
    elif args.clean:
        cmd += " distclean_ts"
    else:
        cmd += " jslib"

    print "BUILD CMD IS:\n  %s" % cmd

    start_time = time.time()
    retval = call(cmd, shell=True)
    print "BUILD TOOK: %.6f seconds" % (time.time() - start_time)

    if 0 != retval:
        error(cmd)

    return retval


@command_requires_env
@command_with_arguments
def command_jslib_clean(options):
    command_jslib([ '--clean' ] + options)

def _get_num_cpus():
    import multiprocessing
    return multiprocessing.cpu_count()

def _get_make_command():
    if TURBULENZOS in ['win32', 'win64']:
        return os.path.join(TURBULENZROOT, 'external', 'gnumake-win32', '3.81', 'bin', 'make.exe')
    return "make"

#######################################################################################################################

@command_no_arguments
def command_tools():
    tools = os.path.normpath(os.path.join(TURBULENZROOT, 'tools'))
    tools_bin = os.path.normpath(os.path.join(tools, 'bin', TURBULENZOS))
    mkdir(tools_bin)

    if TURBULENZOS == 'win32':
        devenv, vs_version_name, msbuild = find_devenv()
        if not devenv and not msbuild:
            error('Could not find a valid install of Visual Studio')
            return 1
        if vs_version_name == '2008':
            proj_postfix = '.vcproj'
            sln_postfix = '.sln'
            vs_version = '9.0'
        elif vs_version_name == '2010':
            proj_postfix = '-2010.vcxproj'
            sln_postfix = '-2010.sln'
            vs_version = '10.0'
        elif vs_version_name == '2012':
            proj_postfix = '-2012.vcxproj'
            sln_postfix = '-2012.sln'
            vs_version = '11.0'
        if devenv:
            base_cmd = [devenv, '/build', 'Release']
        elif msbuild:
            base_cmd = [msbuild, '/t:build', '/p:Configuration=Release',
                        '/p:Platform=Win32', '/p:VisualStudioVersion=%s' % vs_version]

        cgfx2json_proj = os.path.join(tools, 'cgfx2json', 'cgfx2json%s' % proj_postfix)
        cmd = base_cmd + [cgfx2json_proj]
        sh(cmd, console=True, shell=True)
        cp('%s/cgfx2json/Release/cgfx2json.exe' % tools, tools_bin)
        cp('%s/external/Cg/bin/cg.dll' % TURBULENZROOT, tools_bin)
        cp('%s/external/Cg/bin/cgGL.dll' % TURBULENZROOT, tools_bin)

        nvtristrip_sln = os.path.join(tools, 'NvTriStrip', 'NvTriStrip%s' % sln_postfix)
        cmd = base_cmd + [nvtristrip_sln]
        sh(cmd, console=True, shell=True)
        cp('%s/NvTriStrip/NvTriStripper/bin/release/NvTriStripper.exe' % tools, tools_bin)

    else:
        sh('make', cwd=tools, console=True)
        cp('%s/cgfx2json/bin/release/cgfx2json' % tools, tools_bin)
        cp('%s/NvTriStrip/NvTriStripper/bin/release/NvTriStripper' % tools, tools_bin)


@command_no_arguments
def command_tools_clean():
    tools = os.path.normpath(os.path.join(TURBULENZROOT, 'tools'))
    if TURBULENZOS == 'win32':
        devenv, vs_version_name, msbuild = find_devenv()
        if not devenv and not msbuild:
            error('Could not find a valid install of Visual Studio')
            return 1
        if vs_version_name == '2008':
            proj_postfix = '.vcproj'
            sln_postfix = '.sln'
            vs_version = '9.0'
        elif vs_version_name == '2010':
            proj_postfix = '-2010.vcxproj'
            sln_postfix = '-2010.sln'
            vs_version = '10.0'
        elif vs_version_name == '2012':
            proj_postfix = '-2012.vcxproj'
            sln_postfix = '-2012.sln'
            vs_version = '11.0'
        if devenv:
            base_cmd = [devenv, '/clean', 'Release']
        elif msbuild:
            base_cmd = [msbuild, '/t:clean', '/p:Configuration=Release',
                        '/p:Platform=Win32', '/p:VisualStudioVersion=%s' % vs_version]

        cgfx2json_proj = os.path.join(tools, 'cgfx2json', 'cgfx2json%s' % proj_postfix)
        cmd = base_cmd + [cgfx2json_proj]
        sh(cmd, console=True, shell=True)

        nvtristrip_sln = os.path.join(tools, 'NvTriStrip', 'NvTriStrip%s' % sln_postfix)
        cmd = base_cmd + [nvtristrip_sln]
        sh(cmd, console=True, shell=True)
    else:
        sh('make clean', cwd=tools)

#######################################################################################################################

@command_requires_env
@command_with_arguments
def command_apps(options):
    app_dirs = [ 'samples',
                 'apps/inputapp',
                 'apps/multiworm',
                 'apps/sampleapp',
                 'apps/templateapp',
                 'apps/viewer',
                 'apps/tictactoe',
                 'apps/protolibsampleapp' ]
    app_dirs = [ os.path.join(TURBULENZROOT, p) for p in app_dirs ]
    all_apps = {}
    for d in app_dirs:
        all_apps[os.path.split(d)[1]] = d

    parser = argparse.ArgumentParser(description=" Builds or cleans specified app(s), by name or path. If no app is"
                                                 " given, builds or cleans all the listed apps (except samples).")
    parser.add_argument('--clean', action='store_true', help="Clean specified apps (same as apps-clean)")
    parser.add_argument('--refcheck', action='store_true', help="Build with reference checking")
    parser.add_argument('--verbose', action='store_true', help="Display verbose build output")
    parser.add_argument('--compactor', default='uglifyjs', help="Select a compactor for the code build",
                        choices=['uglifyjs', 'yui', 'closure', 'none'])
    parser.add_argument('--mode', action='append', help="Add build mode (default canvas & canvas-debug)",
                        choices=['all', 'plugin', 'plugin-debug', 'canvas', 'canvas-debug'])
    parser.add_argument('--assets-path', action='append', help="Specify additional asset root paths")
    parser.add_argument('app', default='all_apps', nargs='?', help="Select an individual app to build")
    parser.add_argument('--options', nargs='*', help="Additional options to pass to the build process")

    args = parser.parse_args(options)

    if args.app == 'all_apps':
        # If no app given, build all apps except samples
        apps = [ app for app in all_apps.keys() if app != 'samples' ]
    else:
        if args.app not in all_apps and not os.path.exists(args.app):
            print "ERROR: app name not recognised: %s" % args.app
        apps = [ args.app ]

    if not args.mode:
        modes = ['canvas-debug', 'canvas']
    elif 'all' in args.mode:
        modes = ['all']
    else:
        modes = args.mode

    if 'plugin-debug' in modes:
        warning('**DEPRICATED** plugin-debug has been depricated as a build mode. '
            'Please use canvas-debug for debugging. Removing from list of modes.')
        modes = [m for m in modes if m != 'plugin-debug']
        if not modes:
            error("No remaining modes to build.")
            return

    options = ' '.join(args.options) if args.options else ''

    start_time = time.time()

    # Build / clean each app
    for app in apps:
        try:
            app_dir = all_apps[app]
        except KeyError:
            app_dir = app
        print "APP: %s, DIR: %s, BUILDOPTIONS: %s" \
            % (app, app_dir, options)

        if args.clean:
            for mode in modes:
                cmd = _get_make_command() + " -C " + app_dir + " clean"
                cmd += " MODE=%s" % mode
                #cmd += " BUILDVERBOSE=%d" % args.verbose
                cmd += " CMDVERBOSE=%d" % args.verbose
                cmd += " --no-print-directory"
                if 0 != call(cmd, shell=True):
                    return 1

            rmdir('%s/_build' % app_dir)
            rmdir('%s/staticmax' % app_dir)
            rm('%s/mapping_table.json' % app_dir)

        elif args.refcheck:
            make_cmd = "%s -C %s jslib TS_REFCHECK=1 -j %s" \
                % (_get_make_command(), app_dir, _get_num_cpus() + 1)
            print "BUILD CMD IS: %s" % make_cmd
            if 0 != call(make_cmd, shell=True):
                return 1

        else:
            if 0 != command_jslib([]):
                return 1

            buildassets_cmd = ['python', os.path.join(TURBULENZROOT, 'scripts', 'buildassets.py')]
            buildassets_cmd.extend(['--root', TURBULENZROOT])

            # Add asset paths, start with user supplied paths, then app specific, then default assets
            # Build assets searches the paths in order in the case of duplicate source names
            if args.assets_path:
                for p in args.assets_path:
                    buildassets_cmd.extend(['--assets-path', p])
            app_assets = os.path.abspath(os.path.join(app_dir, 'assets'))
            if os.path.isdir(app_assets):
                buildassets_cmd.extend(['--assets-path', app_assets])
            buildassets_cmd.extend(['--assets-path', os.path.join(TURBULENZROOT, 'assets') ])

            if args.verbose:
                buildassets_cmd.append('--verbose')

            try:
                sh(buildassets_cmd, cwd=app_dir, console=True)
            except CalledProcessError as e:
                return e.retcode

            for mode in modes:
                cmd = _get_make_command() + " -C " + app_dir + " build"
                cmd += " -j %d" % (_get_num_cpus() + 1)
                cmd += " MODE=%s" % mode
                cmd += " COMPACTOR=" + args.compactor
                #cmd += " BUILDVERBOSE=%d" % args.verbose
                cmd += " CMDVERBOSE=%d" % args.verbose
                cmd += " --no-print-directory"
                if 0 != call(cmd, shell=True):
                    return 1

    print "BUILD TOOK: %.6f seconds" % (time.time() - start_time)


@command_requires_env
@command_with_arguments
def command_apps_clean(options):
    command_apps([ '--clean' ] + (options or []))

#######################################################################################################################

@command_with_arguments
def command_samples(args):
    command_apps(['samples'] + args)

@command_no_arguments
def command_samples_clean():
    command_apps(['samples', '--clean'])

#######################################################################################################################

def _docs_build_command():
    docs_version_opts = '-D version=%s -D release=%s-dev' % (TURBULENZ_ENGINE_VERSION, TURBULENZ_ENGINE_VERSION)
    docs_src = os.path.join(TURBULENZROOT, 'docs', 'source')
    docs_build = os.path.join(TURBULENZROOT, 'build', 'docs')
    build_command = 'sphinx-build -b html -d ' + os.path.join(docs_build, 'doctrees') + ' ' + \
                    docs_version_opts + ' -c ' + docs_src + ' ' + docs_src + \
                    ' ' + os.path.join(docs_build, 'html')
    return build_command

@command_requires_env
def command_docs(args):
    sh(_docs_build_command(), console=True)
    echo('Docs built to build/docs/html/index.html')

@command_no_arguments
def command_docs_clean():
    rmdir(os.path.join(TURBULENZROOT, 'build', 'docs', 'doctrees'))
    rmdir(os.path.join(TURBULENZROOT, 'build', 'docs'))

@command_requires_env
@command_no_arguments
def command_check_docs():
    # clean the docs first to get all warnings
    command_docs_clean()

    build_fail_regex = re.compile('^.*ERROR.*$|^.*WARNING.*$|^.*SEVERE.*$|^.*Exception occurred.*$', re.MULTILINE)
    result = 0

    cmd = _docs_build_command()
    log(cmd)
    stdout = sh(cmd, wait=True, verbose=False)
    errors = re.findall(build_fail_regex, stdout)
    if len(errors) > 0:
        for e in errors:
            error(e)
        result += 1
        error('Build failed. Documentation contains errors or warnings.')

    if result == 0:
        ok('HTML build')
        print 'Checking links'
        result += check_documentation_links('build/docs')
        if result == 0:
            ok('docs links')

    if result == 0:
        ok('Documentation build succeeded')
    else:
        error('Documentation build failed')
    return result


@command_requires_env
@command_with_arguments
def command_check_docs_links(args):
    if len(args) == 0:
        echo('Path argument required')
        return 1
    return check_documentation_links(args[0])

#######################################################################################################################

@command_requires_env
@command_with_arguments
def command_check_ts(_args=None):

    # If we get a TS linter, run it here

    if 0 != command_jslib(['--refcheck']):
        return 1

    return 0

@command_requires_env
@command_with_arguments
def command_check_py(pyfiles=None):
    def module_glob(pattern):
        if '*' in pattern or '/' in pattern:
            return iglob(pattern)
        else:
            return [pattern]

    pylint = 'python -m pylint.lint --rcfile=.pylintrc -f text -r n'
    pyfiles = pyfiles or ['*.py', 'scripts/*.py']

    files = []
    for pattern in pyfiles:
        for p in module_glob(pattern):
            files.append(p)

    for f in files:
        try:
            sh('%s %s' % (pylint, f), verbose=False)
            ok(f)
        except CalledProcessError as e:
            warning(f)
            echo(e.output)


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
        echo()
    return 1

def main():
    commands = {
        'Environment setup': {
            'env': (command_env, "initialise the development environment"),
            'env-clean': (command_env_clean, "clean the installed environment")
        },
        'JavaScript build': {
            'jslib' : (command_jslib, "build jslib from TypeScript"),
            'jslib-clean' : (command_jslib_clean, "clean jslib files built from TypeScript")
        },
        'Application building': {
            'samples': (command_samples, "build the samples"),
            'samples-clean': (command_samples_clean, "clean the samples"),
            'tools': (command_tools, "build the tools (-h for options)"),
            'tools-clean': (command_tools_clean, "clean the tools"),
            'apps': (command_apps, "build or clean apps (-h for options)"),
            'apps-clean': (command_apps_clean, "clean apps"),
        },
        'Development': {
            'docs': (command_docs, "build the documentation"),
            'docs-clean': (command_docs_clean, "clean the documentation"),
            'check-docs': (command_check_docs,
                           "build  the documentation and check for warnings or errors"),
            'check-docs-links': (command_check_docs_links,
                                 "check links in the documentation (requires build path e.g. 'builds/docs')"),
            'check-ts': (command_check_ts, "check the JavaScript code " \
                             "generated by TypeScript compiler."),
            'check-py': (command_check_py, "check the Python source code"),
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

if __name__ == "__main__":
    exit(main())
