CC=g++
PLATFORM := $(shell uname -s)
M_ARCH := $(shell uname -m)

ifeq ($(PLATFORM),Linux)
  ifeq ($(M_ARCH),x86_64)
    LIBTYPE=linux64
  else
    ifeq ($(M_ARCH),i686)
      LIBTYPE=linux32
    else
      echo Unsupported architecture $(M_ARCH)
    endif
  endif
  LDFLAGS=$(LIBPATHS) -lCg -lCgGL -lGL -lstdc++ -lpthread
else
  CFLAGS += -arch x86_64 -arch i386
  LIBTYPE=macosx
  LDFLAGS=$(LIBPATHS) -arch x86_64 -arch i386 -framework Cg -framework OpenGL -framework Foundation -lstdc++
endif

INCLUDES += -I../common -I../../external/boost/1.43/include
DEFINES +=
CFLAGS += $(DEFINES) $(INCLUDES)

ifeq ($(M_ARCH),i686)
  CFLAGS += -march=pentium4 -msse2 -mfpmath=sse
endif

ifeq ($(DEBUG), 1)
  CFLAGS += -g -DDEBUG -O0
  LDFLAGS += -g
else
  CFLAGS += -O2
endif

ifeq ($(DEBUG), 1)
OBJDIR=obj/debug
BINDIR=bin/debug
else
OBJDIR=obj/release
BINDIR=bin/release
endif

dummy := $(shell test -d $(OBJDIR) || mkdir -p $(OBJDIR))
dummy := $(shell test -d $(BINDIR) || mkdir -p $(BINDIR))

SOURCES=cgfx2json.cpp jsmin.cpp
OBJECTS=$(patsubst %.cpp, $(OBJDIR)/%.o, $(SOURCES))
TOOL=$(BINDIR)/cgfx2json

all: $(SOURCES) $(TOOL)

clean:
	rm -f $(OBJECTS)
	rm -f $(TOOL)
	-rmdir -p $(OBJDIR)
	-rmdir -p $(BINDIR)

$(TOOL): $(OBJECTS)
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@

$(OBJDIR)/%.o : %.cpp
	$(CC) $(CFLAGS) -c $< -o $@
