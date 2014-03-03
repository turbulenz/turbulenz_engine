// Copyright (c) 2009-2013 Turbulenz Limited

#include "stdafx.h"
#include "../common/json.h"
#include <stdio.h>
#include <stdarg.h>
#include <sys/types.h>
#include <sys/stat.h>
#ifdef WIN32
    #include <direct.h>
    #define GetCurrentDir _getcwd
    #define snprintf _snprintf
#else
    #include <unistd.h>
    #define GetCurrentDir getcwd
    #define _stat stat
 #endif
typedef std::map<std::string, const char *> SemanticsMap;
typedef std::map<std::string, std::string> UniformsMap;
typedef std::pair<boost::xpressive::sregex, std::string> UniformRule;
typedef std::list<UniformRule> UniformRules;
typedef std::set<std::string> IncludeList;

extern int jsmin(const char *inputText, char *outputBuffer);


#define VERSION_STRING "cgfx2json 0.23"

//
// Utils
//
static const char *sCompilerArgs[] =
{
    "-DTANGENT0=TEXCOORD6",
    "-DTANGENT=TEXCOORD6",
    "-DBINORMAL0=TEXCOORD7",
    "-DBINORMAL=TEXCOORD7",
    "-DBLENDINDICES0=ATTR7",
    "-DBLENDINDICES=ATTR7",
    "-DBLENDWEIGHT0=ATTR1",
    "-DBLENDWEIGHT=ATTR1",
    "-unroll",
    "all",
    NULL
};

CGcontext sCgContext = NULL;
bool sVerbose = false;
int sErrorCount = 0;
IncludeList includePaths;
IncludeList includeFilenames;

static void CgErrorHandler(CGcontext context, CGerror error, void *data)
{
    if (error == CG_COMPILER_ERROR)
    {
        int * const pCount = (int *)data;
        fprintf(stderr, "#%d %s\n", (*pCount), cgGetErrorString(error));
        printf("\nCg compiler output:\n%s\n", cgGetLastListing(sCgContext));
        (*pCount)++;
    }
}

void ErrorMessage(const char *message, ...)
{
    va_list va;
    va_start(va, message);
    const size_t sTextBufSize = 1024;
    char messageBuffer[sTextBufSize];
    vsnprintf(messageBuffer, sizeof(messageBuffer), message, va);
    fprintf(stderr, "Error: %s\n", messageBuffer);
    printf("Error: %s\n", messageBuffer);
}


static void AddParameter(JSON &json, CGparameter param)
{
    const char * const parameterName = cgGetParameterName(param);

    if (sVerbose)
    {
        puts(parameterName);
    }

    json.AddObject(parameterName);

    const CGtype type = cgGetParameterType(param);
    const CGtype baseType = cgGetParameterBaseType(param);
    int numRows = cgGetParameterRows(param);
    const int numColumns = cgGetParameterColumns(param);
    if (CG_ARRAY == type)
    {
        const int totalArraySize = cgGetArrayTotalSize(param);
        numRows *= totalArraySize;
    }
    json.AddString("type", cgGetTypeString(baseType));
    if (1 < numRows)
    {
        json.AddValue("rows", numRows);
    }
    if (1 < numColumns)
    {
        json.AddValue("columns", numColumns);
    }

    const int maxNumElements = (numColumns * numRows);
    int n;
    if (CG_FLOAT == baseType)
    {
        float * const values = (float *)malloc(maxNumElements * sizeof(float));
        const int numValues = cgGetParameterValuefr(param, maxNumElements, values);
        if (numValues)
        {
            for (n = 0; n < numValues; n++)
            {
                if (values[n] != 0.0f)
                {
                    break;
                }
            }
            if (n < numValues)
            {
                json.AddArray("values", true);
                json.BeginData(true);
                for (n = 0; n < numValues; n++)
                {
                    json.AddData(values[n]);
                }
                json.EndData();
                json.CloseArray(true);
            }
        }
        free(values);
    }
    else if (CG_INT == baseType)
    {
        int * const values = (int *)malloc(maxNumElements * sizeof(int));
        const int numValues = cgGetParameterValueir(param, maxNumElements, values);
        if (numValues)
        {
            for (n = 0; n < numValues; n++)
            {
                if (values[n])
                {
                    break;
                }
            }
            if (n < numValues)
            {
                json.AddArray("values", true);
                json.BeginData(true);
                for (n = 0; n < numValues; n++)
                {
                    json.AddData(values[n]);
                }
                json.EndData();
                json.CloseArray(true);
            }
        }
        free(values);
    }
    else if (CG_BOOL == baseType)
    {
        int * const values = (int *)malloc(maxNumElements * sizeof(int));
        const int numValues = cgGetParameterValueir(param, maxNumElements, values);
        if (numValues)
        {
            for (n = 0; n < numValues; n++)
            {
                if (values[n])
                {
                    break;
                }
            }
            if (n < numValues)
            {
                json.AddArray("values", true);
                json.BeginData(true);
                for (n = 0; n < numValues; n++)
                {
                    json.AddData(values[n]);
                }
                json.EndData();
                json.CloseArray(true);
            }
        }
        free(values);
    }

    json.CloseObject(); // parameter
}


static void AddSamplerState(JSON &json, CGstateassignment sa)
{
    const CGstate state = cgGetSamplerStateAssignmentState(sa);
    const char * const stateName = cgGetStateName(state);
    const CGtype type = cgGetStateType(state);
    int nValues;
    switch (type)
    {
    case CG_FLOAT:
    case CG_FLOAT1:
        {
            const float * const fvalues = cgGetFloatStateAssignmentValues(sa, &nValues);
            json.AddValue(stateName, fvalues[0]);
        }
        break;

    case CG_FLOAT2:
    case CG_FLOAT3:
    case CG_FLOAT4:
        {
            const float * const fvalues = cgGetFloatStateAssignmentValues(sa, &nValues);
            json.AddArray(stateName, true);
            json.BeginData(true);
            for (int n = 0; n < nValues; ++n)
            {
                json.AddData(fvalues[n]);
            }
            json.EndData();
            json.CloseArray(true);
        }
        break;

    case CG_INT:
    case CG_INT1:
        {
            const int * const ivalues = cgGetIntStateAssignmentValues(sa, &nValues);
            json.AddValue(stateName, ivalues[0]);
        }
        break;

    case CG_INT2:
    case CG_INT3:
    case CG_INT4:
        {
            const int * const ivalues = cgGetIntStateAssignmentValues(sa, &nValues);
            json.AddArray(stateName, true);
            json.BeginData(true);
            for (int n = 0; n < nValues; ++n)
            {
                json.AddData(ivalues[n]);
            }
            json.EndData();
            json.CloseArray(true);
        }
        break;

    case CG_BOOL:
    case CG_BOOL1:
        {
            const CGbool * const bvalues = cgGetBoolStateAssignmentValues(sa, &nValues);
            json.AddBoolean(stateName, (bvalues[0] ? true : false));
        }
        break;

    case CG_BOOL2:
    case CG_BOOL3:
    case CG_BOOL4:
        {
            const CGbool * const bvalues = cgGetBoolStateAssignmentValues(sa, &nValues);
            json.AddArray(stateName, true);
            json.BeginData(true);
            for (int n = 0; n < nValues; ++n)
            {
                json.AddBoolean(stateName, (bvalues[n] ? true : false));
            }
            json.EndData();
            json.CloseArray(true);
        }
        break;

    case CG_STRING:
        json.AddString(stateName, cgGetStringStateAssignmentValue(sa));
        break;

    default:
        ErrorMessage("UNEXPECTED State Assignment Type: %s 0x%x (%d)\n",
                        cgGetTypeString(type), type, type);
        break;
    }
}


static const char * sValidStateNames[] =
{
    "DepthTestEnable",
    "DepthFunc",
    "DepthMask",
    "BlendEnable",
    "BlendFunc",
    "CullFaceEnable",
    "CullFace",
    "FrontFace",
    "ColorMask",
    "StencilTestEnable",
    "StencilFunc",
    "StencilOp",
    "PolygonOffsetFillEnable",
    "PolygonOffset",
    "LineWidth",
    "VertexProgram",
    "FragmentProgram"
};

static bool IsValidState(const char* name)
{
    const size_t numNames = sizeof(sValidStateNames)/sizeof(const char *);
    for (size_t index = 0; index < numNames; ++index)
    {
        if (strcmp(sValidStateNames[index], name) == 0)
        {
            return true;
        }
    }
    return false;
}


static bool AddState(JSON &json, CGstateassignment sa)
{
    const CGstate state = cgGetStateAssignmentState(sa);
    const char * const stateName = cgGetStateName(state);
    if (false == IsValidState(stateName))
    {
        ErrorMessage("Invalid state for OpenGL ES 2.0 %s", stateName);
        return false;
    }

    const CGtype type = cgGetStateType(state);
    int nValues;
    switch (type)
    {
    case CG_PROGRAM_TYPE:
        return true;

    case CG_FLOAT:
    case CG_FLOAT1:
        {
            const float * const fvalues = cgGetFloatStateAssignmentValues(sa, &nValues);
            json.AddValue(stateName, fvalues[0]);
        }
        break;

    case CG_FLOAT2:
    case CG_FLOAT3:
    case CG_FLOAT4:
        {
            const float * const fvalues = cgGetFloatStateAssignmentValues(sa, &nValues);
            json.AddArray(stateName, true);
            json.BeginData(true);
            for (int n = 0; n < nValues; ++n)
            {
                json.AddData(fvalues[n]);
            }
            json.EndData();
            json.CloseArray(true);
        }
        break;

    case CG_INT:
    case CG_INT1:
        {
            const int * const ivalues = cgGetIntStateAssignmentValues(sa, &nValues);
            json.AddValue(stateName, ivalues[0]);
        }
        break;

    case CG_INT2:
    case CG_INT3:
    case CG_INT4:
        {
            const int * const ivalues = cgGetIntStateAssignmentValues(sa, &nValues);
            json.AddArray(stateName, true);
            json.BeginData(true);
            for (int n = 0; n < nValues; ++n)
            {
                json.AddData(ivalues[n]);
            }
            json.EndData();
            json.CloseArray(true);
        }
        break;

    case CG_BOOL:
    case CG_BOOL1:
        {
            const CGbool * const bvalues = cgGetBoolStateAssignmentValues(sa, &nValues);
            json.AddBoolean(stateName, (bvalues[0] ? true : false));
        }
        break;

    case CG_BOOL2:
    case CG_BOOL3:
    case CG_BOOL4:
        {
            const CGbool * const bvalues = cgGetBoolStateAssignmentValues(sa, &nValues);
            json.AddArray(stateName, true);
            json.BeginData(true);
            for (int n = 0; n < nValues; ++n)
            {
                json.AddData(bvalues[n]);
            }
            json.EndData();
            json.CloseArray(true);
        }
        break;

    case CG_STRING:
        json.AddString(stateName, cgGetStringStateAssignmentValue(sa));
        break;

    default:
        ErrorMessage("UNEXPECTED State Assignment Type: %s 0x%x (%d)\n",
                        cgGetTypeString(type), type, type);
        return false;
    }
    return true;
}

static void AddMappedParameter(JSON &json,
                               const char *paramName,
                               const char *programString,
                               UniformsMap &uniformRemapping)
{
    const bool isAssembly = (0 == memcmp(programString, "!!ARB", 5));
    const char * const vars = strstr(programString, (isAssembly ? "#var" : "//var"));
    if (NULL != vars)
    {
        const size_t paramNameLength = strlen(paramName);

        const char *var = vars;
        do
        {
            // to skip previous search
            var += 1;
            var = strstr(var, paramName);
        }
        while (NULL != var &&
               ' ' != var[paramNameLength] &&
               ':' != var[paramNameLength] &&
               '[' != var[paramNameLength]);

        if (NULL != var)
        {
            const char * const semantic = strchr(var, ':');
            if (NULL != semantic)
            {
                const char *mappedVariable = strchr((semantic + 1), ':');
                if (NULL != mappedVariable)
                {
                    do
                    {
                        mappedVariable++;
                    }
                    while (*mappedVariable <= ' ');
                    const char *mappedVariableEnd = mappedVariable;
                    while (' ' != *mappedVariableEnd &&
                           ':' != *mappedVariableEnd &&
                           '[' != *mappedVariableEnd &&
                           ',' != *mappedVariableEnd &&
                           0 != *mappedVariableEnd)
                    {
                        mappedVariableEnd++;
                    }

                    const size_t mappedVariableLength = (size_t)(mappedVariableEnd - mappedVariable);

                    if (isAssembly)
                    {
                        if (0 < mappedVariableLength)
                        {
                            // Append location to end of string
                            std::string paramString(paramName, paramNameLength);
                            paramString += ':';
                            // mappedVariable should have the format 'c[{location}]' or 'texunit {location}'
                            const char *location = mappedVariableEnd;
                            while (0 != *location &&
                                   ('0' > *location  ||
                                    '9' < *location))
                            {
                                location++;
                            }
                            if (0 != *location)
                            {
                                const char *locationEnd = location;
                                do
                                {
                                    locationEnd++;
                                }
                                while (0 != *locationEnd &&
                                       '0' <= *locationEnd &&
                                       '9' >= *locationEnd);
                                if (0 != *locationEnd)
                                {
                                    paramString.append(location, (size_t)(locationEnd - location));
                                    json.AddData(paramString.c_str(), paramString.size());
                                }
                            }
                        }
                        return;
                    }

                    const std::string mappedVariableString(mappedVariable, mappedVariableLength);
                    const char * const mappedVariableName = mappedVariableString.c_str();

                    // Check that it is actually used
                    const char * const main = strstr(mappedVariableEnd, "main()");
                    if (NULL != main)
                    {
                        const boost::xpressive::cregex re(boost::xpressive::_b >> mappedVariableString >> boost::xpressive::_b);
                        if (!regex_search((main + 6), re))
                        {
                            return;
                        }
                    }

                    json.AddData(paramName, paramNameLength);

                    const UniformsMap::const_iterator it = uniformRemapping.find(mappedVariableString);
                    if (it == uniformRemapping.end())
                    {
                        uniformRemapping[mappedVariableString] = paramName;
                    }
                    else if (it->second != paramName)
                    {
                        printf("\nUniform variable conflict '%s':\n\t%s\n\t%s\n",
                               mappedVariableName,
                               it->second.c_str(),
                               paramName);
                        exit(1);
                    }
                }
            }
        }
    }
}

static bool AddPass(CGtechnique technique, JSON &json, CGpass pass, UniformsMap &uniformRemapping, const SemanticsMap &semanticsMap)
{
    bool success = true;
    json.AddObject(NULL);

    const char * const passName = cgGetPassName(pass);
    if (NULL != passName)
    {
        json.AddString("name", passName);
    }

    bool firstParameter = true;

#if CG_VERSION_NUM >= 3000
    const int CG_NUMBER_OF_DOMAINS = (CG_TESSELLATION_EVALUATION_DOMAIN + 1);
#endif

    for (int domain = CG_FIRST_DOMAIN; domain < CG_NUMBER_OF_DOMAINS; domain++)
    {
        const CGprogram program = cgGetPassProgram(pass, (CGdomain)domain);
        if (NULL != program)
        {
            const char * const programString = cgGetProgramString(program, CG_COMPILED_PROGRAM);

            CGparameter param = cgGetFirstParameter(program, CG_GLOBAL);
            while (NULL != param)
            {
                if (cgIsParameterUsed(param, program) &&
                    CG_UNIFORM == cgGetParameterVariability(param))
                {
                    if (firstParameter)
                    {
                        firstParameter = false;
                        json.AddArray("parameters", true);
                        json.BeginData(true);
                    }
                    const char * const paramName = cgGetParameterName(param);
                    AddMappedParameter(json, paramName, programString, uniformRemapping);
                }
                param = cgGetNextParameter(param);
            }

            param = cgGetFirstParameter(program, CG_PROGRAM);
            while (NULL != param)
            {
                if (cgIsParameterUsed(param, program) &&
                    CG_UNIFORM == cgGetParameterVariability(param))
                {
                    if (firstParameter)
                    {
                        firstParameter = false;
                        json.AddArray("parameters", true);
                        json.BeginData(true);
                    }
                    const char * const paramName = cgGetParameterName(param);
                    AddMappedParameter(json, paramName, programString, uniformRemapping);
                }
                param = cgGetNextParameter(param);
            }
        }
    }

    if (!firstParameter)
    {
        json.EndData();
        json.CloseArray(true); // parameters
    }


    json.AddArray("semantics", true);
    json.BeginData(true);

    const SemanticsMap::const_iterator itSemanticsEnd = semanticsMap.end();

    CGprogram vertexProgram = cgGetPassProgram(pass, CG_VERTEX_DOMAIN);
    CGparameter vertexInputParameter = cgGetFirstLeafParameter(vertexProgram, CG_PROGRAM);
    while (NULL != vertexInputParameter)
    {
        const CGenum variability = cgGetParameterVariability(vertexInputParameter);
        if (CG_VARYING == variability)
        {
            const CGenum direction = cgGetParameterDirection(vertexInputParameter);
            if (CG_IN == direction ||
                CG_INOUT == direction)
            {
                const char * const semantic = cgGetParameterSemantic(vertexInputParameter);
                if (0 == memcmp(semantic, "ATTR", 4))
                {
                    json.AddData(semantic, strlen(semantic));
                }
                else
                {
                    const SemanticsMap::const_iterator itAttributeName = semanticsMap.find(semantic);
                    if (itAttributeName != itSemanticsEnd)
                    {
                        const char * const attributeName = itAttributeName->second;
                        json.AddData(attributeName, strlen(attributeName));
                    }
                    else
                    {
                        json.AddData(semantic, strlen(semantic));
                        ErrorMessage("%s : Unknown semantic '%s'.", cgGetTechniqueName(technique), semantic);
                        success = false;
                    }
                }
            }
        }
        vertexInputParameter = cgGetNextLeafParameter(vertexInputParameter);
    }

    json.EndData();
    json.CloseArray(true); // semantics


    json.AddObject("states");

    CGstateassignment state = cgGetFirstStateAssignment(pass);
    if (NULL != state)
    {
        do
        {
            success &= AddState(json, state);
            state = cgGetNextStateAssignment(state);
        }
        while (NULL != state);
    }

    json.CloseObject(); // states


    json.AddArray("programs", true);
    json.BeginData(true);

    for (int domain = CG_FIRST_DOMAIN; domain < CG_NUMBER_OF_DOMAINS; domain++)
    {
        const CGprogram program = cgGetPassProgram(pass, (CGdomain)domain);
        if (NULL != program)
        {
            const char * const entryPoint = cgGetProgramString(program, CG_PROGRAM_ENTRY);
            json.AddData(entryPoint, strlen(entryPoint));
        }
        else if (domain == CG_VERTEX_DOMAIN)
        {

            ErrorMessage("%s : No vertex program.", cgGetTechniqueName(technique));
            success = false;
        }
        else if(domain == CG_FRAGMENT_DOMAIN)
        {
            ErrorMessage("%s : No fragment program.", cgGetTechniqueName(technique));
            success = false;
        }
    }

    json.EndData();
    json.CloseArray(true); // programs

    json.CloseObject(); // pass

    return success;
}

static void replace(std::string &target, const std::string &that, const std::string &with)
{
    for (std::string::size_type where = target.find(that); where != std::string::npos; where = target.find(that))
    {
        target.replace(target.begin() + where,
                       target.begin() + where + that.size(),
                       with.begin(),
                       with.end());
    }
}

static bool AddTechnique(JSON &json, CGtechnique technique, UniformsMap &uniformRemapping, const SemanticsMap &semanticsMap)
{
    bool success = true;
    const char * const techniqueName = cgGetTechniqueName(technique);

    if (sVerbose)
    {
        puts(techniqueName);
    }

    json.AddArray(techniqueName);

    CGpass pass = cgGetFirstPass(technique);
    if (NULL == pass)
    {
        success = false;
    }

    while (NULL != pass)
    {
        success &= AddPass(technique, json, pass, uniformRemapping, semanticsMap);

        pass = cgGetNextPass(pass);
    }

    json.CloseArray(); // techniqueName

    return success;
}


static std::string FixShaderCode(char *text, int textLength, const UniformRules &uniformsRename, bool vertexShader)
{
    struct ReplacePair
    {
        ReplacePair(const char *pat, const char *rep) :
            pattern(boost::xpressive::sregex::compile(pat,
                                                      (boost::xpressive::regex_constants::ECMAScript |
                                                       boost::xpressive::regex_constants::optimize))),
            replace(rep)
        {
        }

        boost::xpressive::sregex pattern;
        std::string replace;
    };

    static const ReplacePair sFixPairs[] =
    {
        ReplacePair("\\.0+E\\+0+\\b", ".0"),
        ReplacePair("0*E\\+0+\\b", ""),
        ReplacePair("(\\d+)\\.([0-9][1-9])0*E\\+0+2\\b", "$1$2.0"),
        ReplacePair("(\\d+)\\.([1-9])0*E\\+0+1\\b", "$1$2.0"),
        ReplacePair("(\\d+)\\.0+E\\-0+1\\b", "0.$1"),
        ReplacePair("(\\d+)\\.00+E(\\+\\d+)\\b", "$1.0E$2"),
        ReplacePair("ATI_draw_buffers", "EXT_draw_buffers"),
        ReplacePair("ARB_draw_buffers:enable", "EXT_draw_buffers:require"),
        ReplacePair("#version \\d+", ""),
    };

    static const boost::xpressive::sregex structPattern(boost::xpressive::sregex::compile("\\bstruct\\s+(\\w+)\\s*{[^}]*};",
                                                                                          (boost::xpressive::regex_constants::ECMAScript |
                                                                                           boost::xpressive::regex_constants::optimize)));
    static const int subs[] = {1};

    std::string newtext(text, textLength);

    // Find all the struct declarations
    std::list<std::string> structsList;
    boost::xpressive::sregex_token_iterator cur(newtext.begin(), newtext.end(), structPattern, subs);
    boost::xpressive::sregex_token_iterator end;
    for(; cur != end; ++cur )
    {
        structsList.push_back(*cur);
    }

    // Remove unused struct declarations
    if (!structsList.empty())
    {
        const std::list<std::string>::const_iterator itEnd(structsList.end());
        for (std::list<std::string>::const_iterator it = structsList.begin(); it != itEnd; ++it)
        {
            const std::string &structName(*it);
            boost::xpressive::sregex_iterator cur(newtext.begin(), newtext.end(),
                                                  (boost::xpressive::_b >> structName >> boost::xpressive::_b));
            boost::xpressive::sregex_iterator end;
            int count = 0;
            for(; cur != end; ++cur, ++count)
            {
            }
            if (1 >= count)
            {
                const boost::xpressive::sregex removeStructPattern(boost::xpressive::sregex::compile("\\bstruct\\s+" + structName + "\\s*{[^}]*};"));
                newtext = regex_replace(newtext, removeStructPattern, std::string(""));
            }
        }
        structsList.clear();
    }

    // Fix numbers and GLSL 'require's
    const size_t numPairs = sizeof(sFixPairs) / sizeof(ReplacePair);
    for (size_t n = 0; n < numPairs; n++)
    {
        newtext = regex_replace(newtext, sFixPairs[n].pattern, sFixPairs[n].replace);
    }

    // Fix names of uniform values
    const UniformRules::const_iterator itEnd(uniformsRename.end());
    for (UniformRules::const_iterator it = uniformsRename.begin(); it != itEnd; ++it)
    {
        newtext = regex_replace(newtext, (it->first), (it->second));
    }

    // Fix vertex attributes
    if (vertexShader)
    {
        struct AttributeReplaceRule
        {
            AttributeReplaceRule(const char *src, const char *dst, const char *tn) :
                re(boost::xpressive::_b >> src >> boost::xpressive::_b),
                replace(dst),
                typeName(tn)
            {
            }

            boost::xpressive::sregex re;
            std::string replace;
            const char *typeName;
        };

        static const AttributeReplaceRule sAttributeReplaceRules[] =
        {
            AttributeReplaceRule("gl_Vertex",         "ATTR0",  "vec4"),
            AttributeReplaceRule("gl_Normal",         "ATTR2",  "vec3"),
            AttributeReplaceRule("gl_Color",          "ATTR3",  "vec4"),
            AttributeReplaceRule("gl_SecondaryColor", "ATTR4",  "vec4"),
            AttributeReplaceRule("gl_FogCoord",       "ATTR5",  "float"),
            AttributeReplaceRule("gl_MultiTexCoord0", "ATTR8",  "vec4"),
            AttributeReplaceRule("gl_MultiTexCoord1", "ATTR9",  "vec4"),
            AttributeReplaceRule("gl_MultiTexCoord2", "ATTR10", "vec4"),
            AttributeReplaceRule("gl_MultiTexCoord3", "ATTR11", "vec4"),
            AttributeReplaceRule("gl_MultiTexCoord4", "ATTR12", "vec4"),
            AttributeReplaceRule("gl_MultiTexCoord5", "ATTR13", "vec4"),
            AttributeReplaceRule("gl_MultiTexCoord6", "ATTR14", "vec4"),
            AttributeReplaceRule("gl_MultiTexCoord7", "ATTR15", "vec4")
        };

        const size_t numRules = sizeof(sAttributeReplaceRules) / sizeof(AttributeReplaceRule);
        for (size_t n = numRules; n--; )
        {
            const AttributeReplaceRule &rule(sAttributeReplaceRules[n]);
            if (regex_search(newtext, rule.re))
            {
                newtext = regex_replace(newtext, rule.re, rule.replace);
                newtext = std::string("attribute ") + rule.typeName + " " + rule.replace + ";" + newtext;
            }
        }
    }

    // Remove useless trailing 'return;' statement that causes problems with some drivers
    static const char emptyReturn[] = "return;}";
    const size_t returnPos = newtext.rfind(emptyReturn);
    if (returnPos != newtext.npos &&
        returnPos == (newtext.size() - (sizeof(emptyReturn) - 1)))
    {
        newtext.erase(returnPos, (sizeof(emptyReturn) - 2));
    }

    //
    // OpenGL ES 2.0 conversion
    // See GLSL ref http://www.opengl.org/registry/doc/GLSLangSpec.4.10.6.clean.pdf
    // and ES ref www.khronos.org/files/opengles_shading_language.pdf
    //

    std::string esPrefix("#ifdef GL_ES\n"
                            "#define TZ_LOWP lowp\n"
                            "precision mediump float;\n"
                            "precision mediump int;\n"
                         "#else\n"
                            "#define TZ_LOWP\n"
                         "#endif\n");

    if (newtext.find("gl_Color") != newtext.npos
        || newtext.find("gl_FrontColor") != newtext.npos
        || newtext.find("gl_BackColor") != newtext.npos)
    {
        esPrefix += "varying TZ_LOWP vec4 tz_Color;";
        replace(newtext, "gl_Color", "tz_Color");
        replace(newtext, "gl_FrontColor", "tz_Color");
        replace(newtext, "gl_BackColor", "tz_Color");
    }

    if (newtext.find("gl_SecondaryColor") != newtext.npos
        || newtext.find("gl_SecondaryFrontColor") != newtext.npos
        || newtext.find("gl_SecondaryBackColor") != newtext.npos)
    {
        esPrefix += "varying TZ_LOWP vec4 tz_SecondaryColor;";
        replace(newtext, "gl_SecondaryColor", "tz_SecondaryColor");
        replace(newtext, "gl_SecondaryFrontColor", "tz_SecondaryColor");
        replace(newtext, "gl_SecondaryBackColor", "tz_SecondaryColor");
    }

    if (newtext.find("gl_ClipVertex") != newtext.npos)
    {
        esPrefix += "varying vec4 tz_ClipVertex;";
        replace(newtext, "gl_ClipVertex", "tz_ClipVertex");
    }

    if (newtext.find("gl_FogFragCoord") != newtext.npos)
    {
        esPrefix += "varying float tz_FogFragCoord;";
        replace(newtext, "gl_FogFragCoord", "tz_FogFragCoord");
    }

    if (newtext.find("gl_TexCoord") != newtext.npos)
    {
        // Count how many gl_TexCoord we use, some platforms have limits
        unsigned int numTexCoords = 0;
        char texCoordName[64];
        for (unsigned int n = 0; n < 8; n += 1)
        {
            sprintf(texCoordName, "gl_TexCoord[%u]", n);
            if (newtext.find(texCoordName) != newtext.npos)
            {
                numTexCoords = (n + 1);
            }
        }

        replace(newtext, "gl_TexCoord", "tz_TexCoord");

        sprintf(texCoordName, "varying vec4 tz_TexCoord[%u];", numTexCoords);
        esPrefix += texCoordName;
    }


    // We must insert after any #,eg #extension GL_ARB_draw_buffers:enable
    size_t position = newtext.find_last_of('#');
    if (position != std::string::npos)
    {
        position = newtext.find_first_of('\n', position);
        newtext.insert(position + 1, esPrefix);
    }
    else
    {
        newtext = esPrefix + newtext;
    }

    return newtext;
}

static void ReplaceForwardSlash(char *str, size_t len)
{
    for (size_t i = 0; i < len; i++)
    {
        if (str[i] == '\\')
        {
            str[i] = '/';
        }
    }
}

static const char *ExtractFilename(const char *inputFileName)
{
    const char *filename = strrchr(inputFileName, '\\');
    if (NULL != filename)
    {
        filename++;
    }
    else
    {
        filename = strrchr(inputFileName, '/');
        if (NULL != filename)
        {
            filename++;
        }
        else
        {
            filename = inputFileName;
        }
    }
    return filename;
}

static void AddDependency(CGcontext ctx, const char *pFilePath)
{
    const char * const pFilename = ExtractFilename(pFilePath);

    // Remove the duplicate calls
    const IncludeList::const_iterator itr = includeFilenames.find(pFilename);
    if (itr == includeFilenames.end())
    {
        includePaths.insert(pFilePath);
        includeFilenames.insert(pFilename);
    }
}

static void PrintHelp()
{
    puts("Usage\n"
         "=====\n"
         "  cgfx2json [options]\n"
         "\n"
         "CgFX to json converter.\n"
         "\n"
         "Options\n"
         "=======\n"
         "--version               show program's version number and exit\n"
         "--help, -h              show this help message and exit\n"
         "--verbose, -v           verbose output\n"
         "\n"
         "Asset Generation Options\n"
         "------------------------\n"
         "--asm                   generate ASM code instead of GLSL\n"
         "--json_indent=SIZE, -j SIZE\n"
         "                        json output pretty printing indent size, defaults to 0\n"
         "\n"
         "File Options\n"
         "------------\n"
         "--input=FILE, -i FILE   source FILE to process\n"
         "--output=FILE, -o FILE  output FILE to write to\n"
         "-M                      output dependencies\n"
         "-MF FILE                dependencies output to FILE\n"
         );
    exit(0);
}

static void PrintVersion(const char *outfile)
{
    if (0 == outfile)
    {
        puts(VERSION_STRING);
        exit(0);
    }

    // Get old version and early out if it's the same

    FILE *outf = fopen(outfile, "rb");
    if (0 != outf)
    {
        fseek(outf, 0L, SEEK_END);
        long filesize = ftell(outf);
        fseek(outf, 0L, SEEK_SET);
        char *old_version = (char *)malloc(filesize + 1);
        if (0 != old_version)
        {
            filesize = fread(old_version, 1, filesize, outf);
            old_version[filesize] = 0;
            //printf("Old version: %s\n", old_version);

            if (0 == strcmp(old_version, VERSION_STRING))
            {
                //printf("Versions match\n");
                free(old_version);
                exit(0);
            }

            free(old_version);
        }
        fclose(outf);
    }

    outf = fopen(outfile, "wb");
    if (0 != outf)
    {
        fwrite(VERSION_STRING, sizeof(VERSION_STRING), 1, outf);
        fclose(outf);
        exit(0);
    }

    fprintf(stderr, "Failed to write version information to %s\n", outfile);
    exit(1);
}

//
// Main
//
int main(int argc, char **argv)
{
    char *inputFileName  = NULL;
    char *outputFileName = NULL;

    bool outputDependencies = false;
    const char *dependencyFileName = NULL;

    int indentationStep = 0;
    bool generateGLSL = true;
    bool printVersion = false;

    sVerbose = false;

    for (int argn = 1; argn < argc; argn++)
    {
        if (0 == strcmp(argv[argn], "-i"))
        {
            argn++;
            if (argn < argc)
            {
                inputFileName = argv[argn];
            }
        }
        else if (0 == memcmp(argv[argn], "--input=", (sizeof("--input=") - 1)))
        {
            inputFileName = (argv[argn] + 8);
        }
        else if (0 == strcmp(argv[argn], "-o"))
        {
            argn++;
            if (argn < argc)
            {
                outputFileName = argv[argn];
            }
        }
        else if (0 == memcmp(argv[argn], "--output=", (sizeof("--output=") - 1)))
        {
            outputFileName = (argv[argn] + 9);
        }
        else if (0 == strcmp(argv[argn], "-M"))
        {
            outputDependencies = true;
        }
        else if (0 == strcmp(argv[argn], "-MF"))
        {
            argn++;
            if (argn < argc)
            {
                dependencyFileName = argv[argn];
                outputDependencies = true;
            }
        }
        else if (0 == strcmp(argv[argn], "-j"))
        {
            argn++;
            if (argn < argc)
            {
                indentationStep = atoi(argv[argn]);
            }
        }
        else if (0 == memcmp(argv[argn], "--json_indent=", (sizeof("--json_indent=") - 1)))
        {
            indentationStep = atoi(argv[argn] + 14);
        }
        else if (0 == strcmp(argv[argn], "--asm"))
        {
            generateGLSL = false;
        }
        else if (0 == strcmp(argv[argn], "-v") ||
                 0 == strcmp(argv[argn], "--verbose"))
        {
            sVerbose = true;
        }
        else if (0 == strcmp(argv[argn], "-h") ||
                 0 == strcmp(argv[argn], "--help"))
        {
            PrintHelp();
        }
        else if (0 == strcmp(argv[argn], "--version"))
        {
            printVersion = true;
        }
    }

    if (printVersion)
    {
        PrintVersion(outputFileName);
    }

    if (NULL == inputFileName ||
        (NULL == outputFileName && !outputDependencies))
    {
        PrintHelp();
    }

    if (sVerbose)
    {
        printf("Input file: '%s'\n", inputFileName);

        if (NULL != outputFileName)
        {
            printf("Output file: '%s'\n", outputFileName);
        }

        if (outputDependencies)
        {
            puts("Generating dependencies.");
            if (dependencyFileName)
            {
                printf("Dependencies file: '%s'\n", dependencyFileName);
            }
        }
        else
        {
            printf("Indentation size: %d\n", indentationStep);
        }
        puts("");

        // Check for errors on the inputs
        if (0 > indentationStep)
        {
            ErrorMessage("Indentation size must be greater than or equal to zero.");
            return 1;
        }

        printf("Cg version: %s\n", cgGetString(CG_VERSION));

        if (generateGLSL)
        {
            puts("\nGenerating GLSL programs.");
        }
        else
        {
            puts("\nGenerating ASM programs.");
        }

        puts("");
    }

    // Initialize Cg
    sCgContext = cgCreateContext();
    if (NULL == sCgContext)
    {
        ErrorMessage("Failed to create Cg context");
        return 1;
    }

    if (outputDependencies)
    {
        cgSetCompilerIncludeCallback(sCgContext, &AddDependency);
    }

    sErrorCount = 0;
    cgSetErrorHandler(CgErrorHandler, (void *)&sErrorCount);

    cgGLSetDebugMode(CG_FALSE);
    cgSetParameterSettingMode(sCgContext, CG_DEFERRED_PARAMETER_SETTING);
    //cgSetParameterSettingMode(sCgContext, CG_IMMEDIATE_PARAMETER_SETTING);
    cgGLRegisterStates(sCgContext);
    //cgGLSetManageTextureParameters(sCgContext, CG_TRUE);
    cgSetLockingPolicy(CG_NO_LOCKS_POLICY);

    if (generateGLSL)
    {
#if CG_VERSION_NUM >= 3100
        cgGLSetContextGLSLVersion(sCgContext, CG_GL_GLSL_DEFAULT);
#endif

        const CGstate vpState = cgGetNamedState(sCgContext, "VertexProgram");
        cgSetStateLatestProfile(vpState, CG_PROFILE_GLSLV);

        const CGstate fpState = cgGetNamedState(sCgContext, "FragmentProgram");
        cgSetStateLatestProfile(fpState, CG_PROFILE_GLSLF);

        const CGstate gpState = cgGetNamedState(sCgContext, "GeometryProgram");
        cgSetStateLatestProfile(gpState, CG_PROFILE_GLSLG);

        cgGLEnableProfile(CG_PROFILE_GLSLV);
        cgGLSetOptimalOptions(CG_PROFILE_GLSLV);

        cgGLEnableProfile(CG_PROFILE_GLSLF);
        cgGLSetOptimalOptions(CG_PROFILE_GLSLF);

        cgGLEnableProfile(CG_PROFILE_GLSLG);
        cgGLSetOptimalOptions(CG_PROFILE_GLSLG);
    }
    else
    {
        const CGstate vpState = cgGetNamedState(sCgContext, "VertexProgram");
        cgSetStateLatestProfile(vpState, CG_PROFILE_ARBVP1);

        const CGstate fpState = cgGetNamedState(sCgContext, "FragmentProgram");
        cgSetStateLatestProfile(fpState, CG_PROFILE_ARBFP1);

        cgGLEnableProfile(CG_PROFILE_ARBVP1);
        cgGLSetOptimalOptions(CG_PROFILE_ARBVP1);

        cgGLEnableProfile(CG_PROFILE_ARBFP1);
        cgGLSetOptimalOptions(CG_PROFILE_ARBFP1);
    }

    if (sVerbose)
    {
        puts("Loading cgfx file.");
    }

    // Open cgfx file
    const CGeffect effect = cgCreateEffectFromFile(sCgContext, inputFileName, sCompilerArgs);
    if (NULL == effect)
    {
        ErrorMessage("Failed to load cgfx file.");
        return 1;
    }

    if (outputDependencies)
    {
        if (sVerbose)
        {
            puts("Generating dependencies.");
        }

        const IncludeList::const_iterator itrEnd(includePaths.end());
        char cwd_buffer[FILENAME_MAX];
        char *cwd = GetCurrentDir(cwd_buffer, FILENAME_MAX);
        if (cwd != cwd_buffer)
        {
            ErrorMessage("Failed to calculate working directory.");
            return 1;
        }
        ReplaceForwardSlash(cwd, strlen(cwd));

        FILE *dependenciesFile;
        if (NULL != dependencyFileName)
        {
            dependenciesFile = fopen(dependencyFileName, "wt");
            if (NULL == dependenciesFile)
            {
                ErrorMessage("Failed to create dependency file.");
                return 1;
            }
        }
        else
        {
            dependenciesFile = stdout;
        }

        IncludeList::const_iterator itr = includePaths.begin();
        for (itr = includePaths.begin(); itr != itrEnd; ++itr)
        {
            const char *includePath = itr->c_str();
            char depPath[FILENAME_MAX];
            snprintf(depPath, FILENAME_MAX, "%s%s", cwd, itr->c_str());
            struct _stat fileState;
            if (_stat(depPath, &fileState) == 0)
            {
                fprintf(dependenciesFile, "%s\n", depPath);
            }
            else
            {
                fprintf(dependenciesFile, "%s\n", itr->c_str());
            }
        }

        if (stdout != dependenciesFile)
        {
            fclose(dependenciesFile);
        }
        return 0;
    }

    //
    // Open json file
    //
    JSON json;

    if (!json.Initialize(outputFileName))
    {
        ErrorMessage("Could not write to output file '%s'.", outputFileName);
        return 1;
    }

    json.SetIndentationStep(indentationStep);

    json.AddValue("version", "1", 1);
    json.AddString("name", ExtractFilename(inputFileName), 0);

    //
    // Samplers
    //
    int numSamplers = 0;

    CGparameter param = cgGetFirstEffectParameter(effect);
    while (NULL != param)
    {
        CGstateassignment state = cgGetFirstSamplerStateAssignment(param);
        if (NULL != state)
        {
            if (0 == numSamplers)
            {
                if (sVerbose)
                {
                    puts("\nSamplers:"
                         "\n---------");
                }

                json.AddObject("samplers");
            }

            const char * const samplerName = cgGetParameterName(param);

            if (sVerbose)
            {
                puts(samplerName);
            }

            json.AddObject(samplerName);

            do
            {
                AddSamplerState(json, state);
                state = cgGetNextStateAssignment(state);
            }
            while (NULL != state);

            json.CloseObject(); // sampler

            numSamplers++;
        }
        param = cgGetNextParameter(param);
    }

    if (numSamplers)
    {
        json.CloseObject(); // samplers
    }

    //
    // Parameters
    //
    if (sVerbose)
    {
        puts("\nParameters:"
             "\n-----------");
    }

    int numParameters = 0;

    json.AddObject("parameters");

    param = cgGetFirstEffectParameter(effect);
    while (NULL != param)
    {
        AddParameter(json, param);
        param = cgGetNextParameter(param);
        numParameters++;
    }

    json.CloseObject(); // parameters

    //
    // Techniques
    //
    if (sVerbose)
    {
        puts("\nTechniques:"
             "\n-----------");
    }

    SemanticsMap semanticsMap;
    semanticsMap["POSITION"] = "ATTR0";
    semanticsMap["POSITION0"] = "ATTR0";
    semanticsMap["BLENDWEIGHT"] = "ATTR1";
    semanticsMap["BLENDWEIGHT0"] = "ATTR1";
    semanticsMap["NORMAL"] = "ATTR2";
    semanticsMap["NORMAL0"] = "ATTR2";
    semanticsMap["COLOR"] = "ATTR3";
    semanticsMap["COLOR0"] = "ATTR3";
    semanticsMap["COLOR1"] = "ATTR4";
    semanticsMap["SPECULAR"] = "ATTR4";
    semanticsMap["FOGCOORD"] = "ATTR5";
    semanticsMap["TESSFACTOR"] = "ATTR5";
    semanticsMap["PSIZE0"] = "ATTR6";
    semanticsMap["BLENDINDICES"] = "ATTR7";
    semanticsMap["BLENDINDICES0"] = "ATTR7";
    semanticsMap["TEXCOORD"] = "ATTR8";
    semanticsMap["TEXCOORD0"] = "ATTR8";
    semanticsMap["TEXCOORD1"] = "ATTR9";
    semanticsMap["TEXCOORD2"] = "ATTR10";
    semanticsMap["TEXCOORD3"] = "ATTR11";
    semanticsMap["TEXCOORD4"] = "ATTR12";
    semanticsMap["TEXCOORD5"] = "ATTR13";
    semanticsMap["TEXCOORD6"] = "ATTR14";
    semanticsMap["TEXCOORD7"] = "ATTR15";
    semanticsMap["TANGENT"] = "ATTR14";
    semanticsMap["TANGENT0"] = "ATTR14";
    semanticsMap["BINORMAL0"] = "ATTR15";
    semanticsMap["BINORMAL"] = "ATTR15";
    semanticsMap["PSIZE"] = "ATTR6";

    bool success = true;
    int numTechniques = 0;

    UniformsMap uniformRemapping;

    json.AddObject("techniques");

    CGtechnique technique = cgGetFirstTechnique(effect);
    while (NULL != technique)
    {
        success &= AddTechnique(json, technique, uniformRemapping, semanticsMap);
        technique = cgGetNextTechnique(technique);
        numTechniques++;
    }

    json.CloseObject(); // techniques

    if (false == success)
    {
        return 1;
    }

    // Build patterns to rename uniforms
    UniformRules uniformsRename;
    const UniformsMap::const_iterator itEnd(uniformRemapping.end());
    for (UniformsMap::const_iterator it = uniformRemapping.begin(); it != itEnd; ++it)
    {
        uniformsRename.push_back(UniformRule((boost::xpressive::_b >> (it->first) >> boost::xpressive::_b),
                                             (it->second)));
    }
    uniformRemapping.clear();

    //
    // Programs
    //
    if (sVerbose)
    {
        puts("\nPrograms:"
             "\n---------");
    }

    int numPrograms = 0;

    json.AddObject("programs");

    std::set<std::string> processedPrograms;

    CGprogram program = cgGetFirstProgram(sCgContext);
    while (NULL != program)
    {
        if (cgIsProgramCompiled(program))
        {
            const std::string entryPoint(cgGetProgramString(program, CG_PROGRAM_ENTRY));
            if (processedPrograms.find(entryPoint) != processedPrograms.end())
            {
                program = cgGetNextProgram(program);
                continue;
            }
            processedPrograms.insert(entryPoint);

            const char * const programName = entryPoint.c_str();

            if (sVerbose)
            {
                puts(programName);
            }

            json.AddObject(programName);

            const CGdomain domain = cgGetProgramDomain(program);
            const char * const domainString = cgGetDomainString(domain);
            json.AddString("type", domainString);

            const char * const programString = cgGetProgramString(program, CG_COMPILED_PROGRAM);
            const size_t originalLength = strlen(programString);
            char *minimizedString;
            int minimizedLength;
            if (0 == memcmp(programString, "!!ARB", 5))
            {
                char * const cleanString = (char *)malloc(originalLength + 1);
                int dn = 0;
                for (size_t n = 0; n < originalLength; n++)
                {
                    if ('#' == programString[n])
                    {
                       n++;
                       while ('\n' != programString[n])
                       {
                           n++;
                       }
                    }
                    else
                    {
                        cleanString[dn] = programString[n];
                        dn++;
                    }
                }
                cleanString[dn] = 0;
                minimizedString = (char *)malloc(dn);
                minimizedLength = jsmin(cleanString, minimizedString);
                free(cleanString);

                json.AddMultiLineString("code", minimizedString, minimizedLength);
            }
            else
            {
                minimizedString = (char *)malloc(originalLength);
                minimizedLength = jsmin(programString, minimizedString);

                const std::string fixedShaderCode(FixShaderCode(minimizedString,
                                                                minimizedLength,
                                                                uniformsRename,
                                                                (CG_VERTEX_DOMAIN == domain)));

                json.AddMultiLineString("code", fixedShaderCode.c_str(), fixedShaderCode.size());
            }

            json.CloseObject(); // program

            free(minimizedString);

            numPrograms++;
        }

        program = cgGetNextProgram(program);
    }

    json.CloseObject(); // programs


    if (sVerbose)
    {
        printf("\nNumber of samplers: %d\n", numSamplers);
        printf("Number of parameters: %d\n", numParameters);
        printf("Number of techniques: %d\n", numTechniques);
        printf("Number of programs: %d\n", numPrograms);
    }

    cgDestroyEffect(effect);

    cgDestroyContext(sCgContext);

    return 0;
}
