// Copyright (c) 2009-2015 Turbulenz Limited

#include "stdafx.h"
#include "../common/json.h"
#include <stdio.h>
#include <stdarg.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#ifdef WIN32
# include <windows.h>
# include <tchar.h>
# include <direct.h>
# define GetCurrentDir _getcwd
# define snprintf _snprintf
#else
# include <unistd.h>
# define GetCurrentDir getcwd
# define _stat stat
#endif
typedef std::map<std::string, const char *> SemanticsMap;
typedef std::map<std::string, std::string> UniformsMap;
typedef std::pair<boost::xpressive::sregex, std::string> UniformRule;
typedef std::list<UniformRule> UniformRules;
typedef std::set<std::string> IncludeList;

extern int jsmin(const char *inputText, char *outputBuffer);


#define VERSION_STRING "cgfx2json 0.5"

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

static void replace(std::string &target,
                    const std::string &that,
                    const std::string &with)
{
    for (std::string::size_type where = target.find(that);
         where != std::string::npos;
         where = target.find(that))
    {
        target.replace(target.begin() + where,
                       target.begin() + where + that.size(),
                       with.begin(),
                       with.end());
    }
}

static bool IsAscii(const std::vector<uint8_t> data)
{
    const size_t size = data.size() - 1;
    for (size_t i = 0 ; i < size ; ++i)
    {
        const uint8_t d = data[i];
        if (7 == d || 10 == d || 13 == d || (32 <= d && d <=127))
        {
            continue;
        }

        printf("Char value %d at position %d\n", (int )d, (int )i);
        return false;
    }
    return true;
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

static const char encode_base64[]=
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

static bool EncodeBase64String(const std::vector<uint8_t> &src,
                               std::string &out_base64)
{
    const size_t sourceLength = src.size();
    size_t numBlocks = sourceLength / 3;
    size_t remainder = sourceLength - (numBlocks*3);
    size_t outLength = (numBlocks * 4) + ((0 == remainder)?(0):(4));

    // Blocks

    const uint8_t *sourceData = &src[0];

    out_base64.resize(outLength);
    char *destinationBuffer = &out_base64[0];

    for (size_t blockIdx = 0 ; blockIdx < numBlocks ; ++blockIdx)
    {
        uint8_t a = sourceData[0];
        uint8_t b = sourceData[1];
        uint8_t c = sourceData[2];
        sourceData += 3;

        uint8_t outA = a >> 2;
        uint8_t outB = ((a & 0x3) << 4) | (b >> 4);
        uint8_t outC = ((b & 0xf) << 2) | (c >> 6);
        uint8_t outD = c & 0x3f;

        destinationBuffer[0] = encode_base64[outA];
        destinationBuffer[1] = encode_base64[outB];
        destinationBuffer[2] = encode_base64[outC];
        destinationBuffer[3] = encode_base64[outD];
        destinationBuffer += 4;
    }

    // Extras

    switch (remainder)
    {
    case 1:
        {
            uint8_t a = sourceData[0];

            uint8_t outA = a >> 2;
            uint8_t outB = ((a & 0x3) << 4);

            destinationBuffer[0] = encode_base64[outA];
            destinationBuffer[1] = encode_base64[outB];
            destinationBuffer[2] = destinationBuffer[3] = '=';
        }
        break;

    case 2:
        {
            uint8_t a = sourceData[0];
            uint8_t b = sourceData[1];

            uint8_t outA = a >> 2;
            uint8_t outB = ((a & 0x3) << 4) | (b >> 4);
            uint8_t outC = ((b & 0xf) << 2);

            destinationBuffer[0] = encode_base64[outA];
            destinationBuffer[1] = encode_base64[outB];
            destinationBuffer[2] = encode_base64[outC];
            destinationBuffer[3] = '=';
        }

    default:
        break;
    }
    destinationBuffer += 4;

    return true;
}

bool sVerbose = false;
int sErrorCount = 0;

// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------

IncludeList      sIncludePaths;
IncludeList      sIncludeFilenames;

const char * const sValidStateNames[] = {
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

class Effect
{
public:
    Effect()
        : mCgContext(0)
        , mCgEffect(0)
        , mNumSamplers(0)
        , mNumParameters(0)
        , mNumTechniques(0)
    {
    }

    ~Effect()
    {
        if (0 != mCgContext)
        {
            cgDestroyEffect(mCgEffect);
            cgDestroyContext(mCgContext);
            mCgContext = 0;
        }
    }

    bool Initialize(const char *cgfxFilename)
    {
        mCgContext = cgCreateContext();
        if (NULL == mCgContext)
        {
            ErrorMessage("Failed to create Cg context");
            return false;
        }

        cgSetCompilerIncludeCallback(mCgContext, &AddDependency);

        sErrorCount = 0;
        cgSetErrorHandler(CgErrorHandler, this); // (void *)&sErrorCount);

        cgGLSetDebugMode(CG_FALSE);
        cgSetParameterSettingMode(mCgContext, CG_DEFERRED_PARAMETER_SETTING);
        //cgSetParameterSettingMode(mCgContext, CG_IMMEDIATE_PARAMETER_SETTING);
        cgGLRegisterStates(mCgContext);
        //cgGLSetManageTextureParameters(mCgContext, CG_TRUE);
        cgSetLockingPolicy(CG_NO_LOCKS_POLICY);

        if (!InitializeContext(mCgContext))
        {
            ErrorMessage("Failed to Initialize Context");
            return false;
        }

        if (sVerbose)
        {
            puts("Loading cgfx file.");
        }

        const char **args = GetCompilerArgs();
        mCgEffect = cgCreateEffectFromFile(mCgContext, cgfxFilename, args);
        if (0 == mCgEffect)
        {
            ErrorMessage("Failed to load cgfx file.");
            return false;
        }

        return true;
    }

    CGcontext GetCgContext()
    {
        return mCgContext;
    }

    bool AddSamplers(JSON &json)
    {
        // int numSamplers = 0;

        CGparameter param = cgGetFirstEffectParameter(mCgEffect);
        while (0 != param)
        {
            CGstateassignment state = cgGetFirstSamplerStateAssignment(param);
            if (NULL != state)
            {
                if (0 == mNumSamplers)
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

                mNumSamplers++;
            }
            param = cgGetNextParameter(param);
        }

        if (mNumSamplers)
        {
            json.CloseObject(); // samplers
        }

        return true;
    }

    bool AddParameters(JSON &json)
    {
        if (sVerbose)
        {
            puts("\nParameters:"
                 "\n-----------");
        }

        json.AddObject("parameters");

        CGparameter param = cgGetFirstEffectParameter(mCgEffect);
        while (NULL != param)
        {
            AddParameter(json, param);
            param = cgGetNextParameter(param);
            mNumParameters++;
        }

        json.CloseObject(); // parameters

        return true;
    }

    bool AddTechniques(JSON &json, UniformRules &out_uniformsRename)
    {
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
        // int numTechniques = 0;

        UniformsMap uniformRemapping;

        json.AddObject("techniques");

        CGtechnique technique = cgGetFirstTechnique(mCgEffect);
        while (NULL != technique)
        {
            success &= AddTechnique(json, technique, uniformRemapping, semanticsMap);
            technique = cgGetNextTechnique(technique);
            mNumTechniques++;
        }

        json.CloseObject(); // techniques

        // Build patterns to rename uniforms
        // UniformRules uniformsRename;
        const UniformsMap::const_iterator itEnd(uniformRemapping.end());
        for (UniformsMap::const_iterator it = uniformRemapping.begin(); it != itEnd; ++it)
        {
            out_uniformsRename.push_back
                (UniformRule
                 ((boost::xpressive::_b >> (it->first) >> boost::xpressive::_b),
                  (it->second)));
        }

        uniformRemapping.clear();

        return true;
    }

    CGprogram GetFirstProgram()
    {
        return cgGetFirstProgram(mCgContext);
    }

    CGprogram GetNextProgram(CGprogram current)
    {
        return cgGetNextProgram(current);
    }

    const char *GetProgramEntry(CGprogram program)
    {
        return cgGetProgramString(program, CG_PROGRAM_ENTRY);
    }

    const char *GetProgramType(CGprogram program)
    {
        const CGdomain domain = cgGetProgramDomain(program);
        return cgGetDomainString(domain);
    }

    bool GetProgramCodeString(CGprogram program,
                              const UniformRules &uniformsRename,
                              std::string &out_code)
    {
        bool vertexShader = (CG_VERTEX_DOMAIN == cgGetProgramDomain(program));
        const char *programString =
            cgGetProgramString(program, CG_COMPILED_PROGRAM);
        return PostProcessCode(programString,
                               uniformsRename,
                               vertexShader,
                               out_code);
    }

    bool GetProgramCodeStringByEntry(const std::string &entry,
                                     const UniformRules &uniformsRename,
                                     std::string &out_code)
    {
        CGprogram p = cgGetFirstProgram(mCgContext);
        while (0 != p)
        {
            const char * const e = cgGetProgramString(p, CG_PROGRAM_ENTRY);
            if (entry == e)
            {
                return GetProgramCodeString(p, uniformsRename, out_code);
            }

            p = cgGetNextProgram(p);
        }

        return false;
    }

    int GetNumSamplers() const
    {
        return mNumSamplers;
    }

    int GetNumParameters() const
    {
        return mNumParameters;
    }

    int GetNumTechniques() const
    {
        return mNumTechniques;
    }

protected:

    static void CgErrorHandler(CGcontext context, CGerror error, void *data)
    {
        if (error == CG_COMPILER_ERROR)
        {
            Effect *effect = (Effect *)data;
            // int * const pCount = (int *)data;
            fprintf(stderr, "#%d %s\n", sErrorCount, cgGetErrorString(error));
            printf("\nCg compiler output:\n%s\n",
                   cgGetLastListing(effect->mCgContext));
            ++sErrorCount;
        }
    }

    static void AddDependency(CGcontext ctx, const char *pFilePath)
    {
        const char * const pFilename = ExtractFilename(pFilePath);

        // Remove the duplicate calls
        const IncludeList::const_iterator itr = sIncludeFilenames.find(pFilename);
        if (itr == sIncludeFilenames.end())
        {
            sIncludePaths.insert(pFilePath);
            sIncludeFilenames.insert(pFilename);
        }
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

    static bool AddPass(CGtechnique technique,
                        JSON &json,
                        CGpass pass,
                        UniformsMap &uniformRemapping,
                        const SemanticsMap &semanticsMap)
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

    static bool AddTechnique(JSON &json, CGtechnique technique,
                             UniformsMap &uniformRemapping,
                             const SemanticsMap &semanticsMap)
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

    virtual const char **GetCompilerArgs() = 0;
    virtual bool InitializeContext(CGcontext context) = 0;
    virtual bool PostProcessCode(const char *programString,
                                 const UniformRules &uniformsRename,
                                 bool vertexShader,
                                 std::string &out_finalCode) = 0;

    CGcontext        mCgContext;
    CGeffect         mCgEffect;
    int              mNumSamplers;
    int              mNumParameters;
    int              mNumTechniques;
};

// -----------------------------------------------------------------------------
// ASMEffect
// -----------------------------------------------------------------------------

static const char *sCompilerArgsGLSL[] =
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

class ASMEffect : public Effect
{
    static ASMEffect *sInstance;

public:
    static Effect *GetInstance(const char *cgfxFilename)
    {
        if (0 == sInstance)
        {
            sInstance = new ASMEffect();
            if (!sInstance->Initialize(cgfxFilename))
            {
                delete sInstance;
                sInstance = nullptr;
            }
        }
        return sInstance;
    }

    static void CleanUp()
    {
        if (0 != sInstance)
        {
            delete sInstance;
            sInstance = 0;
        }
    }

protected:
    virtual const char **GetCompilerArgs()
    {
        return sCompilerArgsGLSL;
    }

    virtual bool InitializeContext(CGcontext context)
    {
        const CGstate vpState = cgGetNamedState(mCgContext, "VertexProgram");
        cgSetStateLatestProfile(vpState, CG_PROFILE_ARBVP1);

        const CGstate fpState = cgGetNamedState(mCgContext, "FragmentProgram");
        cgSetStateLatestProfile(fpState, CG_PROFILE_ARBFP1);

        cgGLEnableProfile(CG_PROFILE_ARBVP1);
        cgGLSetOptimalOptions(CG_PROFILE_ARBVP1);

        cgGLEnableProfile(CG_PROFILE_ARBFP1);
        cgGLSetOptimalOptions(CG_PROFILE_ARBFP1);

        return true;
    }

    virtual bool PostProcessCode(const char *programString,
                                 const UniformRules &uniformsRename,
                                 bool vertexShader,
                                 std::string &out_finalCode)
    {
        const size_t originalLength = strlen(programString);
        char *minimizedString = NULL;
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

            out_finalCode.resize(dn);
            // minimizedString = (char *)malloc(dn);
            minimizedLength = jsmin(cleanString, &out_finalCode[0]);
            out_finalCode.resize(minimizedLength);

            free(cleanString);
        }
        else
        {
            out_finalCode = programString;
        }

        return true;
    }
};

ASMEffect *ASMEffect::sInstance = 0;

// -----------------------------------------------------------------------------
// GLSLEffect
// -----------------------------------------------------------------------------

class GLSLEffect : public Effect
{
    static GLSLEffect *sInstance;

public:
    static Effect *GetInstance(const char *cgfxFilename)
    {
        if (0 == sInstance)
        {
            sInstance = new GLSLEffect();
            if (!sInstance->Initialize(cgfxFilename))
            {
                delete sInstance;
                sInstance = nullptr;
            }
        }
        return sInstance;
    }

    static void CleanUp()
    {
        if (0 != sInstance)
        {
            delete sInstance;
            sInstance = 0;
        }
    }

protected:

    virtual const char **GetCompilerArgs()
    {
        return sCompilerArgsGLSL;
    }

    virtual bool InitializeContext(CGcontext context)
    {
#if CG_VERSION_NUM >= 3100
        cgGLSetContextGLSLVersion(context, CG_GL_GLSL_DEFAULT);
#endif

        const CGstate vpState = cgGetNamedState(context, "VertexProgram");
        cgSetStateLatestProfile(vpState, CG_PROFILE_GLSLV);

        const CGstate fpState = cgGetNamedState(context, "FragmentProgram");
        cgSetStateLatestProfile(fpState, CG_PROFILE_GLSLF);

        const CGstate gpState = cgGetNamedState(context, "GeometryProgram");
        cgSetStateLatestProfile(gpState, CG_PROFILE_GLSLG);

        cgGLEnableProfile(CG_PROFILE_GLSLV);
        cgGLSetOptimalOptions(CG_PROFILE_GLSLV);

        cgGLEnableProfile(CG_PROFILE_GLSLF);
        cgGLSetOptimalOptions(CG_PROFILE_GLSLF);

        cgGLEnableProfile(CG_PROFILE_GLSLG);
        cgGLSetOptimalOptions(CG_PROFILE_GLSLG);

        return true;
    }

    virtual bool PostProcessCode(const char *programString,
                                 const UniformRules &uniformsRename,
                                 bool vertexShader,
                                 std::string &out_finalCode)
    {
        const char *text = programString;
        int textLength = (int )strlen(programString);

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

        static const ReplacePair sFixPairs[] = {
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

        static const boost::xpressive::sregex structPattern
            (boost::xpressive::sregex::compile
             ("\\bstruct\\s+(\\w+)\\s*{[^}]*};",
              (boost::xpressive::regex_constants::ECMAScript |
               boost::xpressive::regex_constants::optimize)));
        static const int subs[] = {1};

        // std::string newtext(text, textLength);
        out_finalCode = programString;
        std::string &newtext = out_finalCode;

        // Find all the struct declarations
        std::list<std::string> structsList;
        {
            boost::xpressive::sregex_token_iterator cur(newtext.begin(), newtext.end(), structPattern, subs);
            boost::xpressive::sregex_token_iterator end;
            for (; cur != end; ++cur)
            {
                structsList.push_back(*cur);
            }
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

        std::string esPrefix;

        esPrefix = "#ifdef GL_ES\n"
            "#define TZ_LOWP lowp\n"
            "precision highp float;\n"
            "precision highp int;\n"
            "#else\n"
            "#define TZ_LOWP\n"
            "#endif\n";

        if (newtext.find("dFdx") != newtext.npos
            || newtext.find("dFdy") != newtext.npos
            || newtext.find("fwidth") != newtext.npos)
        {
            esPrefix += "#extension GL_OES_standard_derivatives : enable\n";
        }

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

        return true;
    }
};

GLSLEffect *GLSLEffect::sInstance = 0;

// -----------------------------------------------------------------------------
// HLSL3Effect
// -----------------------------------------------------------------------------

static const char *sCompilerArgsHLSL[] =
{
    "-unroll",
    "all",
    NULL
};

class HLSL3Effect : public Effect
{
    static HLSL3Effect *sInstance;

public:
    static Effect *GetInstance(const char *cgfxFilename)
    {
        if (0 == sInstance)
        {
            sInstance = new HLSL3Effect();
            if (!sInstance->Initialize(cgfxFilename))
            {
                delete sInstance;
                sInstance = nullptr;
            }
        }
        return sInstance;
    }

    static void CleanUp()
    {
        if (0 != sInstance)
        {
            delete sInstance;
            sInstance = 0;
        }
    }

protected:
    virtual const char **GetCompilerArgs()
    {
        return sCompilerArgsHLSL;
    }

    virtual bool InitializeContext(CGcontext context)
    {
        const CGstate vpState = cgGetNamedState(mCgContext, "VertexProgram");
        cgSetStateLatestProfile(vpState, CG_PROFILE_HLSLV);

        const CGstate fpState = cgGetNamedState(mCgContext, "FragmentProgram");
        cgSetStateLatestProfile(fpState, CG_PROFILE_HLSLF);

        cgGLEnableProfile(CG_PROFILE_HLSLV);
        cgGLSetOptimalOptions(CG_PROFILE_HLSLV);

        cgGLEnableProfile(CG_PROFILE_HLSLF);
        cgGLSetOptimalOptions(CG_PROFILE_HLSLF);

        return true;
    }

    virtual bool PostProcessCode(const char *programString,
                                 const UniformRules &uniformsRename,
                                 bool vertexShader,
                                 std::string &out_finalCode)
    {
        return FixHLSLCode(programString,
                           uniformsRename,
                           vertexShader,
                           3,
                           out_finalCode);
    }

    bool FixHLSLCode(const char *programString,
                     const UniformRules &uniformsRename,
                     bool vertexShader,
                     int generateHLSL,
                     std::string &out_finalCode)
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

        static const ReplacePair sFixPairs[] = {
            ReplacePair("\\.0+E0+f", ".0f"),
            ReplacePair("\\.0+E\\+0+\\b", ".0"),
            ReplacePair("0*E\\+0+\\b", ""),
            ReplacePair("(\\d+)\\.([0-9][1-9])0*E\\+0+2\\b", "$1$2.0"),
            ReplacePair("(\\d+)\\.([1-9])0*E\\+0+1\\b", "$1$2.0"),
            ReplacePair("(\\d+)\\.0+E\\-0+1\\b", "0.$1"),
            ReplacePair("(\\d+)\\.00+E(\\+\\d+)\\b", "$1.0E$2"),
            ReplacePair("float4 (\\w+):BLENDINDICES0", "uint4 $1:BLENDINDICES0"),
            ReplacePair("float4 _COL0:COLOR0;float4 _POSITION:SV_Position;", "float4 _POSITION:SV_Position;float4 _COL0:COLOR0;"),
        };

        static const boost::xpressive::sregex structPattern
            (boost::xpressive::sregex::compile
             ("\\bstruct\\s+(\\w+)\\s*{[^}]*};",
              (boost::xpressive::regex_constants::ECMAScript |
               boost::xpressive::regex_constants::optimize)));
        static const int subs[] = {1};

        out_finalCode = programString;
        std::string &newtext = out_finalCode;
        // std::string newtext(text, textLength);

        // Find all the struct declarations
        std::list<std::string> structsList;
        {
            boost::xpressive::sregex_token_iterator cur(newtext.begin(),
                                                        newtext.end(),
                                                        structPattern,
                                                        subs);
            boost::xpressive::sregex_token_iterator end;
            for (; cur != end; ++cur)
            {
                structsList.push_back(*cur);
            }
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

        // Fix numbers
        const size_t numPairs = sizeof(sFixPairs) / sizeof(ReplacePair);
        for (size_t n = 0; n < numPairs; n++)
        {
            newtext = regex_replace(newtext, sFixPairs[n].pattern, sFixPairs[n].replace);
        }

        // Fix declaration of temporary variables
        if (generateHLSL == 3)
        {
            // This would change all global variables
            const boost::xpressive::sregex tmpFloatPattern(boost::xpressive::sregex::compile("float([\\dx]*\\s+\\w+);"));
            newtext = regex_replace(newtext, tmpFloatPattern, "static float$1;");
            /*
              const boost::xpressive::sregex tmpBoolPattern(boost::xpressive::sregex::compile("bool([\\dx]*\\s+\\w+);"));
              newtext = regex_replace(newtext, tmpBoolPattern, "static bool$1;");
            */

            // Fix uniforms
            const UniformRules::const_iterator itEnd(uniformsRename.end());
            for (UniformRules::const_iterator it = uniformsRename.begin(); it != itEnd; ++it)
            {
                const boost::xpressive::sregex renamedFloatPattern(boost::xpressive::sregex::compile(std::string("static float([\\dx]*\\s+_") + it->second + ");"));
                newtext = regex_replace(newtext, renamedFloatPattern, "float$1;");
                /*
                  const boost::xpressive::sregex renamedBoolPattern(boost::xpressive::sregex::compile(std::string("static bool([\\dx]*\\s+_") + it->second + ");"));
                  newtext = regex_replace(newtext, renamedBoolPattern, "bool$1;");
                */
            }
        }

        // Fix names of uniform values
        const UniformRules::const_iterator itEnd(uniformsRename.end());
        for (UniformRules::const_iterator it = uniformsRename.begin();
             it != itEnd;
             ++it)
        {
            // Avoid issue with "texture" being a reserved word
            if (it->second != "texture")
            {
                newtext = regex_replace(newtext, (it->first), (it->second));
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

        // Fix semantic registers by adding dummy input position
        if (!vertexShader && generateHLSL == 5)
        {
            static const char svposition[] = ":SV_Position";
            if (newtext.find(svposition) == newtext.npos)
            {
                static const char main[] = " main(in ";
                const size_t mainPos = newtext.find(main);
                if (mainPos != newtext.npos)
                {
                    replace(newtext, " main(in ", " main( in float4 _dummyposition:SV_Position,in ");
                }
            }
        }

        // Fix texture and sampler registers
        {
            static const boost::xpressive::sregex texturePattern(boost::xpressive::sregex::compile("\\bTexture[^<]+<float4>(\\w+);",
                                                                                                   (boost::xpressive::regex_constants::ECMAScript |
                                                                                                    boost::xpressive::regex_constants::optimize)));

            std::vector<std::string> textures;
            boost::xpressive::sregex_token_iterator curt(newtext.begin(), newtext.end(), texturePattern, subs);
            boost::xpressive::sregex_token_iterator end;
            for (; curt != end; ++curt)
            {
                textures.push_back(*curt);
            }

            const size_t numTextures = textures.size();
            char registerName[4];

            for (size_t n = 0; n < numTextures; n++)
            {
                const std::string &textureName(textures[n]);

                const boost::xpressive::sregex samplerUsagePattern(boost::xpressive::sregex::compile("\\b" + textureName + "\\.Sample\\((\\w+),"));
                const boost::xpressive::sregex_token_iterator curs(newtext.begin(), newtext.end(), samplerUsagePattern, subs);
                if (curs != end)
                {
                    const std::string &samplerName(*curs);

                    sprintf(registerName, "%u", (unsigned int)n);

                    // Assign register to sampler using it
                    const boost::xpressive::sregex samplerPattern(boost::xpressive::sregex::compile("\\bSamplerState\\s+" + samplerName + ";"));
                    newtext = regex_replace(newtext, samplerPattern, "SamplerState " + samplerName + ":register(s" + registerName + ");");

                    // Assign register to texture
                    const boost::xpressive::sregex curTexturePattern(boost::xpressive::sregex::compile("<float4>" + textureName + ";"));
                    newtext = regex_replace(newtext, curTexturePattern, "<float4>" + textureName + ":register(t" + registerName + ");");

                    if (vertexShader)
                    {
                        // Change from Sample to SampleLevel
                        const boost::xpressive::sregex samplerPattern(boost::xpressive::sregex::compile("\\b" + textureName + "\\.Sample\\(" + samplerName + ",([^;]+);"));
                        newtext = regex_replace(newtext, samplerPattern, textureName + ".SampleLevel(" + samplerName + ",($1,0);");
                    }
                }
            }
        }

        // Add viewport remapping
        if (newtext.find("cout._POSITION") != newtext.npos)
        {
            const size_t returnPosition = newtext.find("return cout;");
            if (returnPosition != newtext.npos)
            {
                const boost::xpressive::sregex returnPattern(boost::xpressive::sregex::compile("\\breturn cout;"));
                newtext = regex_replace(newtext, returnPattern, "if(_tz_hack_invertY){cout._POSITION.y=-cout._POSITION.y;}"
                                        "cout._POSITION.z=(cout._POSITION.z+cout._POSITION.w)*0.5f;"
                                        "return cout;");
                const size_t firstLine = newtext.find("\n");
                newtext.insert(firstLine + 1, "cbuffer tz_hacks:register(b1){bool _tz_hack_invertY;};");
            }
        }

        return true;
    }
};

HLSL3Effect *HLSL3Effect::sInstance = 0;

// -----------------------------------------------------------------------------
// HLSL5Effect
// -----------------------------------------------------------------------------

class HLSL5Effect : public HLSL3Effect
{
    static HLSL5Effect *sInstance;

public:
    static Effect *GetInstance(const char *cgfxFilename)
    {
        if (0 == sInstance)
        {
            sInstance = new HLSL5Effect();
            if (!sInstance->Initialize(cgfxFilename))
            {
                delete sInstance;
                sInstance = nullptr;
            }
        }
        return sInstance;
    }

    static void CleanUp()
    {
        if (0 != sInstance)
        {
            delete sInstance;
            sInstance = 0;
        }
    }

protected:

    virtual bool InitializeContext(CGcontext context)
    {
        const CGstate vpState = cgGetNamedState(mCgContext, "VertexProgram");
        cgSetStateLatestProfile(vpState, CG_PROFILE_VS_5_0);

        const CGstate fpState = cgGetNamedState(mCgContext, "FragmentProgram");
        cgSetStateLatestProfile(fpState, CG_PROFILE_PS_5_0);

        const CGstate gpState = cgGetNamedState(mCgContext, "GeometryProgram");
        cgSetStateLatestProfile(gpState, CG_PROFILE_GS_5_0);

        cgGLEnableProfile(CG_PROFILE_VS_5_0);
        cgGLSetOptimalOptions(CG_PROFILE_VS_5_0);

        cgGLEnableProfile(CG_PROFILE_PS_5_0);
        cgGLSetOptimalOptions(CG_PROFILE_PS_5_0);

        cgGLEnableProfile(CG_PROFILE_GS_5_0);
        cgGLSetOptimalOptions(CG_PROFILE_GS_5_0);

        return true;
    }

    virtual bool PostProcessCode(const char *programString,
                                 const UniformRules &uniformsRename,
                                 bool vertexShader,
                                 std::string &out_finalCode)
    {
        return FixHLSLCode(programString,
                           uniformsRename,
                           vertexShader,
                           5,
                           out_finalCode);
    }
};

HLSL5Effect *HLSL5Effect::sInstance = 0;

static void CleanUpEffects()
{
    HLSL5Effect::CleanUp();
    HLSL3Effect::CleanUp();
    GLSLEffect::CleanUp();
    ASMEffect::CleanUp();
}

static void PrintHelp(int error=0)
{
    puts(
"Usage\n"
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
"--hlsl3 <property>,<compile-script>\n"
"--hlsl5 <property>,<compile-script>\n"
"--binary <property>,<compile-script>\n"
"                        For each program, optionall generate HLSL code of the\n"
"                        given type, call out to an external script\n"
"                        (<compile-script>) to perform a compile step, and add\n"
"                        the compiled output to the resulting JSON (base64\n"
"                        encoded if necessary) as a property called <property>.\n"
"                        The script is called with arguments:\n"
"                          <entryPoint> - name of entry point for this program\n"
"                          <cgfxFile>   - original CGFX source file\n"
"                          <type>       - 'vertex' / 'pixel'\n"
"                          <inputfile>  - file containing GLSL / HLSL code\n"
"                          <output>     - file that the script shoudl create\n"
"\n"
"File Options\n"
"------------\n"
"--input=FILE, -i FILE   source FILE to process\n"
"--output=FILE, -o FILE  output FILE to write to\n"
"-M                      output dependencies\n"
"-MF FILE                dependencies output to FILE\n"
         );
    exit(error);
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
            filesize = (long)fread(old_version, 1, filesize, outf);
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

static bool WriteFile(const char *fileName, const std::string &data)
{
    FILE *f = fopen(fileName, "wb");
    if (NULL == f)
    {
        return false;
    }

    size_t bytesToWrite = data.size();
    size_t offset = 0;
    while (0 < bytesToWrite)
    {
        size_t written = fwrite(&data[offset], 1, bytesToWrite, f);
        if (0 == written)
        {
            fclose(f);
            return false;
        }

        bytesToWrite -= written;
        offset += written;
    }
    fclose(f);
    return true;
}

static bool ReadFile(const char *fileName, std::vector<uint8_t> &data)
{
    FILE *f = fopen(fileName, "rb");
    if (NULL == f)
    {
        return false;
    }

    fseek(f, 0L, SEEK_END);
    const long filesize = ftell(f);
    fseek(f, 0L, SEEK_SET);

    size_t bytesToRead = (size_t )filesize;
    size_t offset = 0;

    data.resize(bytesToRead);

    while (0 < bytesToRead)
    {
        size_t read = fread(&data[offset], 1, bytesToRead, f);
        if (0 == read)
        {
            fclose(f);
            return false;
        }

        bytesToRead -= read;
        offset += read;
    }
    fclose(f);
    return true;
}

static bool DecomposeBinaryArg(const char *_arg,
                               std::string &out_property,
                               std::string &out_script)
{
    const char *firstComma = strstr(_arg, ",");
    if (0 == firstComma)
    {
        fprintf(stderr, "--binary flags requires a comma ','\n");
        return false;
    }
    if (0 != strstr(firstComma+1, ","))
    {
        fprintf(stderr, "Badly formatted (0) --binary arg: %s\n", _arg);
        return false;
    }

    out_property = std::string(_arg, firstComma-_arg);
    out_script = std::string(firstComma+1);

    fprintf(stderr, "prop: %s, script: %s\n",
           out_property.c_str(), out_script.c_str());

    if (0 == out_property.size() || 0 == out_script.size())
    {
        fprintf(stderr, "Badly formatted (1) --binary arg: %s\n", _arg);
        return false;
    }

    return true;
}

static bool BinaryCompile(const std::string &code,
                          const char *compiler,
                          const char *shaderType,
                          const char *entryPoint,
                          const char *cgfxFilename,
                          int generateHLSL,
                          const UniformRules &uniformsRename,
                          std::string &out_base64)
{
#ifdef _WIN32
    int dwRetVal = 0;
    char tempPath[MAX_PATH];
    char inputFilename[MAX_PATH];
    char outputFilename[MAX_PATH];

    dwRetVal = GetTempPathA(MAX_PATH, tempPath);
    if (dwRetVal > MAX_PATH || (dwRetVal == 0))
    {
        ErrorMessage("Failed to get Temporary Path");
        return 1;
    }

    if (0 == GetTempFileNameA(tempPath, "shadercode", 0, inputFilename) ||
        0 == GetTempFileNameA(tempPath, "binary", 0, outputFilename))
    {
        out_base64 = "Failed to get temporary files";
        return false;
    }

    // Set up the command

    // TODO: can we unify this and have all the parameters controlled
    // by a batch file, as for the generic case?

    std::string command = "\"";
    command += compiler;
    command += "\"";

    std::string hlslCode;
    if (generateHLSL)
    {
        Effect *hlslEffect;

        command += " /T ";
        if (generateHLSL == 5)
        {
            hlslEffect = HLSL5Effect::GetInstance(cgfxFilename);

            if (0 == strcmp(shaderType, "vertex"))
            {
                command += "vs_5_0";
            }
            else if (0 == strcmp(shaderType, "fragment"))
            {
                command += "ps_5_0";
            }
            else if (0 == strcmp(shaderType, "geometry"))
            {
                command += "gs_5_0";
            }
        }
        else //if (generateHLSL == 3)
        {
            hlslEffect = HLSL3Effect::GetInstance(cgfxFilename);

            if (0 == strcmp(shaderType, "vertex"))
            {
                command += "vs_3_0";
            }
            else if (0 == strcmp(shaderType, "fragment"))
            {
                command += "ps_3_0";
            }
            else if (0 == strcmp(shaderType, "geometry"))
            {
                command += "gs_3_0";
            }
        }
        command += " /Fo ";
        command += outputFilename;
        command += " ";
        command += inputFilename;

        if (nullptr == hlslEffect)
        {
            out_base64 = "Failed to create hlsl context for ";
            out_base64 += cgfxFilename;
            return false;
        }

        // Extract the HLSL code and use it inplace of 'code'

        hlslEffect->GetProgramCodeStringByEntry(entryPoint,
                                                uniformsRename,
                                                hlslCode);

        // Write the HLSL code to a temporary file

        if (!WriteFile(inputFilename, hlslCode))
        {
            out_base64 = "Failed to write temp file";
            return false;
        }
    }
    else
    {
        command += " ";
        command += entryPoint;
        command += " ";
        command += cgfxFilename;
        command += " ";
        command += shaderType;
        command += " ";
        command += inputFilename;
        command += " ";
        command += outputFilename;

        // Write the ASM/GLSL code to a temporary file

        if (!WriteFile(inputFilename, code))
        {
            out_base64 = "Failed to write temp file";
            return false;
        }
    }

    printf("Running binary compiler: %s\n", command.c_str());
    if (0 != system(command.c_str()))
    {
        out_base64 = "Failed to execute binary compile command: ";
        out_base64 += command;
        return false;
    }

    std::vector<uint8_t> data;
    if (!ReadFile(outputFilename, data))
    {
        out_base64 = "Failed to read compiled shader: ";
        out_base64 += outputFilename;
        return false;
    }

    if (!IsAscii(data))
    {
        if (!EncodeBase64String(data, out_base64))
        {
            out_base64 = "Failed to encode shader binary as base64";
            return false;
        }
    }
    else
    {
        out_base64 = std::string((const char *)(&data[0]), data.size());
    }

    return true;
#else
    out_base64 = "Binary compile not supported on this platform";
    return false;
#endif
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

    std::vector<std::string> binaryProperties;
    std::vector<std::string> binaryCompilers;
    std::vector<int> generateHLSL;

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
        else if (0 == strcmp(argv[argn], "--hlsl5"))
        {
            std::string property;
            std::string script;

            argn++;
            if (argn < argc)
            {
                if (!DecomposeBinaryArg(argv[argn], property, script))
                {
                    PrintHelp(1);
                }

                binaryProperties.push_back(property);
                binaryCompilers.push_back(script);
                generateHLSL.push_back(5);
            }
        }
        else if (0 == strcmp(argv[argn], "--hlsl3"))
        {
            std::string property;
            std::string script;

            argn++;
            if (argn < argc)
            {
                if (!DecomposeBinaryArg(argv[argn], property, script))
                {
                    PrintHelp(1);
                }

                binaryProperties.push_back(property);
                binaryCompilers.push_back(script);
                generateHLSL.push_back(3);
            }
        }
        else if (0 == strcmp(argv[argn], "--binary"))
        {
            std::string property;
            std::string script;

            argn++;
            if (argn < argc)
            {
                if (!DecomposeBinaryArg(argv[argn], property, script))
                {
                    PrintHelp(1);
                }

                binaryProperties.push_back(property);
                binaryCompilers.push_back(script);
                generateHLSL.push_back(0);
            }
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
        for (size_t i = 0 ; i < generateHLSL.size() ; ++i)
        {
            if (0 != generateHLSL[i])
            {
                printf("\nGenerating HLSL Shader Model %d programs.",
                       generateHLSL[i]);
            }
        }
        puts("");
    }

    // We always need at least a GLSL or ASM version of the effect

    Effect *effect;
    if (generateGLSL)
    {
        effect = GLSLEffect::GetInstance(inputFileName);
    }
    else
    {
        effect = ASMEffect::GetInstance(inputFileName);
    }
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

        const IncludeList &includePaths = sIncludePaths;

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

    if (!effect->AddSamplers(json))
    {
        fprintf(stderr, "Failed parsing Samplers\n");
        return 1;
    }

    if (!effect->AddParameters(json))
    {
        fprintf(stderr, "Failed parsing Parameters\n");
        return 1;
    }

    UniformRules uniformsRename;
    if (!effect->AddTechniques(json, uniformsRename))
    {
        fprintf(stderr, "Failed parsing Techniques\n");
        return 1;
    }

    //
    // Programs.
    //

    if (sVerbose)
    {
        puts("\nPrograms:"
             "\n---------");
    }

    json.AddObject("programs");

    int numPrograms = 0;
    std::set<std::string> processedPrograms;
    CGprogram program = effect->GetFirstProgram();
    while (0 != program)
    {
        if (cgIsProgramCompiled(program))
        {
            // Program name.  Property name of the object

            const char * const programName = effect->GetProgramEntry(program);
            if (processedPrograms.find(programName) != processedPrograms.end())
            {
                program = effect->GetNextProgram(program);
                continue;
            }
            processedPrograms.insert(programName);
            json.AddObject(programName);

            if (sVerbose)
            {
                puts(programName);
            }

            // Program Type

            const char * const programType = effect->GetProgramType(program);
            json.AddString("type", programType);

            // Code

            std::string finalCode;
            effect->GetProgramCodeString(program, uniformsRename, finalCode);
            json.AddMultiLineString("code", finalCode.c_str(), finalCode.size());

            const size_t numBinaryCompilers = binaryCompilers.size();
            for (size_t i = 0 ; i < numBinaryCompilers ; ++i)
            {
                const std::string &script = binaryCompilers[i];
                const std::string &property = binaryProperties[i];
                const int genHLSL = generateHLSL[i];

                printf("i: %d, script: %s, property: %s, genHLSL: %d\n",
                       i, script.c_str(), property.c_str(), genHLSL);

                std::string base64OrError;
                if (!BinaryCompile(finalCode,
                                   script.c_str(),
                                   programType,
                                   programName,
                                   inputFileName,
                                   genHLSL,
                                   uniformsRename,
                                   base64OrError))
                {
                    ErrorMessage("Compile failed: %s", base64OrError.c_str());
                    return 1;
                }

                json.AddMultiLineString(property.c_str(),
                                        base64OrError.c_str(),
                                        base64OrError.size());
            }

            json.CloseObject(); // program

            numPrograms++;
        }

        program = effect->GetNextProgram(program);
    }

    json.CloseObject(); // programs

    if (sVerbose)
    {
        printf("\nNumber of samplers: %d\n", effect->GetNumSamplers());
        printf("Number of parameters: %d\n", effect->GetNumParameters());
        printf("Number of techniques: %d\n", effect->GetNumTechniques());
        printf("Number of programs: %d\n", numPrograms);
    }

    CleanUpEffects();

    return 0;
}
