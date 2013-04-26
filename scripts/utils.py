import platform
import sys
import os
import os.path
import re
import errno
import stat
from subprocess import Popen, PIPE, STDOUT
from shutil import rmtree, copy, Error as ShError

#######################################################################################################################

SYSNAME = platform.system()
if SYSNAME == 'Linux':
    if platform.machine() == 'x86_64':
        TURBULENZOS = 'linux64'
    else:
        TURBULENZOS = 'linux32'
elif SYSNAME == 'Windows':
    TURBULENZOS = 'win32'
elif SYSNAME == 'Darwin':
    TURBULENZOS = 'macosx'
else:
    echo('unknown os')
    exit(1)
PYTHON = 'python%s.%s' % (sys.version_info[0], sys.version_info[1])
ENV = 'env'
TURBULENZROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Required to get the git commands working on Windows
if not 'HOME' in os.environ:
    os.environ['HOME'] = '%s%s' % (os.environ['HOMEDRIVE'], os.environ['HOMEPATH'])

#######################################################################################################################

def echo(message=''):
    print message

def log(message):
    echo(' >> ' + message)

COLORED_OUTPUT = sys.stdout.isatty() and SYSNAME != 'Windows'

def error(message):
    if COLORED_OUTPUT:
        log('\033[31m[ERROR]\033[0m   - %s' % message)
    else:
        log('[ERROR]   - %s' % message)

# pylint: disable=C0103
def ok(message):
    if COLORED_OUTPUT:
        log('\033[32m[OK]\033[0m      - %s' % message)
    else:
        log('[OK]      - %s' % message)
# pylint: enable=C0103

def warning(message):
    if COLORED_OUTPUT:
        log('\033[1m\033[33m[WARNING]\033[0m - %s' % message)
    else:
        log('[WARNING] - %s' % message)

#######################################################################################################################

# pylint: disable=C0103
def cp(src, dst, verbose=True):
    if verbose:
        echo('Copying: %s -> %s' % (os.path.basename(src), os.path.basename(dst)))
    try:
        copy(src, dst)
    except (ShError, IOError) as e:
        error(str(e))
# pylint: enable=C0103

# pylint: disable=C0103
def rm(filename, verbose=True):
    if verbose:
        echo('Removing: %s' % filename)
    try:
        os.remove(filename)
    except OSError as _:
        pass
# pylint: enable=C0103

def mkdir(path, verbose=True):
    if verbose:
        echo('Creating: %s' % path)
    try:
        os.makedirs(path)
    except OSError as exc:
        if exc.errno == errno.EEXIST:
            pass
        else:
            raise

def rmdir(path, verbose=True):
    def _handle_remove_readonly(func, path, exc):
        excvalue = exc[1]
        if func in (os.rmdir, os.remove) and excvalue.errno == errno.EACCES:
            os.chmod(path, stat.S_IRWXU| stat.S_IRWXG| stat.S_IRWXO) # 0777
            func(path)
        else:
            raise

    if verbose:
        echo('Removing: %s' % path)
    try:
        rmtree(path, onerror=_handle_remove_readonly)
    except OSError:
        pass

#######################################################################################################################

# pylint: disable=W0231
class CalledProcessError(Exception):
    def __init__(self, retcode, cmd, output=None):
        self.retcode = retcode
        self.cmd = cmd
        self.output = output
    def __str__(self):
        return "Command '%s' returned non-zero exit status %d" % (self.cmd, self.retcode)
# pylint: enable=W0231

# pylint: disable=C0103
def sh(command, cwd=None, env=None, verbose=True, console=False, ignore=False, shell=False, wait=True):
    if isinstance(command, list):
        command_list = command
        command_string = ' '.join(command)
    else:
        command_list = command.split()
        command_string = command

    if verbose:
        echo('Executing: %s' % command_string)

    if wait:
        if console:
            process = Popen(command_list, stderr=STDOUT, cwd=cwd, shell=shell, env=env)
        else:
            process = Popen(command_list, stdout=PIPE, stderr=STDOUT, cwd=cwd, shell=shell, env=env)

        output, _ = process.communicate()
        output = str(output)
        retcode = process.poll()
        if retcode:
            if ignore is False:
                raise CalledProcessError(retcode, command_list, output=output)

        if output is not None:
            output = output.rstrip()

        return output
    else:
        if SYSNAME == 'Windows':
            DETACHED_PROCESS = 0x00000008
            return Popen(command_list, creationflags=DETACHED_PROCESS, cwd=cwd, shell=shell, env=env)
        else:
            return Popen(command_list, stdout=PIPE, stderr=STDOUT, cwd=cwd, shell=shell, env=env)
# pylint: enable=C0103

#######################################################################################################################

def command_no_arguments(fn):
    def new(arguments=None):
        return fn()
    return new

def command_with_arguments(fn):
    def new(arguments = None, *args, **kwargs):
        return fn(arguments or [], *args, **kwargs)
    return new

def command_requires_env(fn):
    virtual_env = os.environ.get('VIRTUAL_ENV', None)
    if virtual_env:
        def new(*args, **kwargs):
            return fn(*args, **kwargs)
    else:
        def new(*args, **kwargs):
            error('Virtualenv not activated, required for: %s' % sys.argv[1])
    return new

#######################################################################################################################

def check_documentation_links(build_path):
    bad_link_regex = [re.compile('.*<em class="xref std std-ref">.*<\/em>.*'),
                      re.compile('.*?:ref:?.*')]
    result = 0

    for (dirpath, _, filenames) in os.walk(build_path):
        for f in filenames:
            if os.path.splitext(f)[1] == '.html':
                file_path = os.path.join(dirpath, f)
                html_file = open(file_path, 'rt')
                html = html_file.read()

                for regex in bad_link_regex:
                    match = regex.search(html)
                    if match:
                        result += 1
                        warning(file_path)
                        error('Broken or malformed link with contents "%s"' % match.group(0))

                html_file.close()

    if result > 0:
        error('%d broken or malformed link%s' % (result, 's' if result > 1 else ''))

    return result

#######################################################################################################################

if platform.system() == "Windows":
    # pylint: disable=W0404

    # pylint: disable=F0401, E0602
    def _get_reg_software_value(store, path, key):
        import _winreg

        value = None
        try:
            install_key = _winreg.OpenKey(store, 'SOFTWARE\%s' % path)
            (value, _) = _winreg.QueryValueEx(install_key, key)
        except WindowsError:
            try:
                install_key = _winreg.OpenKey(_winreg.HKEY_LOCAL_MACHINE,
                                              'SOFTWARE\Wow6432Node\%s' % path)
                (value, _) = _winreg.QueryValueEx(install_key, key)
            except WindowsError:
                pass
        return value
    # pylint: enable=F0401, E0602

    # pylint: disable=F0401, E0602
    def find_devenv():
        from _winreg import HKEY_LOCAL_MACHINE
        devenv_path = _get_reg_software_value(HKEY_LOCAL_MACHINE, 'Microsoft\VisualStudio\9.0', 'InstallDir')

        if devenv_path is not None:
            devenv_path = join(devenv_path, 'devenv.com')

        return devenv_path
    # pylint: enable=F0401, E0602
    # pylint: enable=W0404
else:
    def find_devenv():
        return None

