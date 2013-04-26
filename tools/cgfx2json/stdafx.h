// Copyright (c) 2009-2011 Turbulenz Limited

// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently, but
// are changed infrequently
//

#ifdef _MSC_VER
#pragma once
#endif

#ifndef _WIN32_WINNT		// Allow use of features specific to Windows XP or later.
#define _WIN32_WINNT 0x0501	// Change this to the appropriate value to target other versions of Windows.
#endif

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif

#ifndef _USE_MATH_DEFINES
#define _USE_MATH_DEFINES
#endif

#ifndef BOOST_DISABLE_THREADS
#define BOOST_DISABLE_THREADS
#endif

#include <boost/xpressive/xpressive.hpp>
#include <stdio.h>
#include <math.h>
#include <float.h>
#include <limits.h>
#include <string.h>
#include <stdlib.h>
#include <string>
#include <list>
#include <map>
#include <set>

#include <Cg/cg.h>
#include <Cg/cgGL.h>
