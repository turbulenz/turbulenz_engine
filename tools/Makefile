# Copyright (c) 2009-2011 Turbulenz Limited

subdirs := $(dir $(wildcard */Makefile))
subdirsclean := $(addsuffix -clean,$(subdirs))

.PHONY: all
all: $(subdirs)

.PHONY: clean
clean: $(subdirsclean)

.PHONY: $(subdirs)
$(subdirs):
	make -C $@

.PHONY: $(subdirsclean)
$(subdirsclean):
	make -C $(@D) clean
