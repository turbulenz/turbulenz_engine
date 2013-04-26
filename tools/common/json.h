// Copyright (c) 2010-2011 Turbulenz Limited
#ifndef __JSON_H__
#define __JSON_H__

#ifdef _MSC_VER
#pragma once
#endif

class JSON
{
public:
    JSON() :
      mFile(NULL),
      mIndentationStep(0),
      mIndentation(0),
      mFirstChild(false),
      mFirstValue(false)
    {
    }

    ~JSON()
    {
        if (NULL != mFile)
        {
            if (mIndentationStep)
            {
                fputs("\n}\n", mFile);
            }
            else
            {
                fputc('}', mFile);
            }

            fclose(mFile);
        }
    }

    bool Initialize(const char *filename)
    {
        mFile = fopen(filename, "wb");
        if (NULL == mFile)
        {
            return false;
        }

        fputc('{', mFile);

        mIndentation = mIndentationStep;

        mFirstChild = true;

        mFirstValue = false;

        for (unsigned n = 0; n < sizeof(mIndentationBuffer); n++)
        {
            mIndentationBuffer[n] = ' ';
        }

        return true;
    }

    void SetIndentationStep(int indentationStep)
    {
        mIndentationStep = indentationStep;
        if (mIndentation <= 0)
        {
            mIndentation = indentationStep;
        }
    }

    void AddArray(const char *name, bool inLine = false)
    {
        if (false == mFirstChild)
        {
            fputc(',', mFile);
        }

        Indent();

        PrintName(name);

        if (inLine)
        {
            fputs(": [", mFile);
        }
        else
        {
            fputc(':', mFile);
            Indent();
            fputc('[', mFile);
            mIndentation += mIndentationStep;
        }

        mFirstChild = true;
    }

    void CloseArray(bool inLine = false)
    {
        if (!inLine)
        {
            mIndentation -= mIndentationStep;
            Indent();
        }

        mFirstChild = false;

        fputc(']', mFile);
    }

    void BeginData(bool inLine = false)
    {
        if (mFirstChild)
        {
            mFirstChild = false;
        }
        else
        {
            fputc(',', mFile);
        }

        if (!inLine)
        {
            Indent();
        }

        mFirstValue = true;
    }

    void AddData(int value)
    {
        if (mFirstValue)
        {
            mFirstValue = false;
            fprintf(mFile, "%d", value);
        }
        else
        {
            fprintf(mFile, ",%d", value);
        }
    }

    void AddData(double value)
    {
        if (mFirstValue)
        {
            mFirstValue = false;
        }
        else
        {
            fputc(',', mFile);
        }

        if (0.0 == value)
        {
            fputc('0', mFile);
        }
        else
        {
            const int valueInt = (int)value;
            if ((double)valueInt == value)
            {
                fprintf(mFile, "%d", valueInt);
            }
            else
            {
                char buffer[256];
                int numChars = sprintf(buffer, "%g", value);

                // clean buffer
                for (int n = 0; n < numChars; n++)
                {
                    if (buffer[n] == ',')
                    {
                        buffer[n] = '.';
                    }
                    else if (buffer[n] == 'e')
                    {
                        const int o = (buffer[n + 1] == '-' ? (n + 2) : (n + 1));
                        while (buffer[o] == '0')
                        {
                            memmove(buffer + o, buffer + o + 1, numChars - o - 1);
                            numChars -= 1;
                        }
                    }
                }

                fwrite(buffer, 1, numChars, mFile);
            }
        }
    }

    void AddData(const char *text, size_t textLength)
    {
        if (mFirstValue)
        {
            mFirstValue = false;
        }
        else
        {
            fputc(',', mFile);
        }

        fputc('\"', mFile);

        const char *data = text;
        const char * const dataEnd = (data + textLength);
        while (data < dataEnd)
        {
            if (*data <= ' ')
            {
                do
                {
                    data++;
                }
                while (*data <= ' ');
                if (data >= dataEnd)
                {
                    break;
                }
            }

            fputc(*data, mFile);
            data++;
        }

        fputc('\"', mFile);
    }

    void AddRawData(const char *text, size_t textLength)
    {
        if (mFirstValue)
        {
            mFirstValue = false;
        }
        else
        {
            fputc(',', mFile);
        }

        const char *data = text;
        const char * const dataEnd = (data + textLength);
        while (data < dataEnd)
        {
            if (*data <= ' ')
            {
                do
                {
                    data++;
                }
                while (*data <= ' ');
                if (data < dataEnd)
                {
                    fputc(',', mFile);
                }
                else
                {
                    break;
                }
            }

            fputc(*data, mFile);
            data++;
        }
    }

    void EndData()
    {
    }

    void AddValue(const char *name, const char *text, const size_t textLength)
    {
        if (mFirstChild)
        {
            mFirstChild = false;
        }
        else
        {
            fputc(',', mFile);
        }

        Indent();

        PrintName(name);
        fputs(": ", mFile);
        fwrite(text, 1, textLength, mFile);
    }

    void AddValue(const char *name, double value)
    {
        if (mFirstChild)
        {
            mFirstChild = false;
        }
        else
        {
            fputc(',', mFile);
        }

        Indent();

        PrintName(name);
        fputs(": ", mFile);

        mFirstValue = true;
        AddData(value);
    }

    void AddString(const char *name, const char *text, size_t textLength = 0)
    {
        if (mFirstChild)
        {
            mFirstChild = false;
        }
        else
        {
            fputc(',', mFile);
        }

        Indent();

        PrintName(name);
        fputs(": \"", mFile);
        if (0 == textLength)
        {
            textLength = strlen(text);
        }
        fwrite(text, 1, textLength, mFile);
        fputc('\"', mFile);
    }

    void AddBoolean(const char *name, bool value)
    {
        if (mFirstChild)
        {
            mFirstChild = false;
        }
        else
        {
            fputc(',', mFile);
        }

        Indent();

        PrintName(name);
        fputs(": ", mFile);
        if (value)
        {
            fwrite("true", 1, 4, mFile);
        }
        else
        {
            fwrite("false", 1, 5, mFile);
        }
    }

    void AddMultiLineString(const char *name, const char *text, size_t textLength = 0)
    {
        if (mFirstChild)
        {
            mFirstChild = false;
        }
        else
        {
            fputc(',', mFile);
        }

        Indent();

        PrintName(name);
        fputs(": \"", mFile);
        if (0 == textLength)
        {
            textLength = strlen(text);
        }
        const char * const textEnd = (text + textLength);
        for (size_t n = 0; n < textLength;)
        {
            const char * const currentLine = (text + n);
            const char *nextLine = currentLine;
            while ('\n' != *nextLine)
            {
                nextLine++;
                if (nextLine >= textEnd)
                {
                    fwrite(currentLine, 1, (textLength - n), mFile);
                    fputc('\"', mFile);
                    return;
                }
            }

            const size_t lineLength = (size_t)(nextLine - currentLine);
            if (0 < lineLength)
            {
                fwrite(currentLine, 1, lineLength, mFile);
                fputc('\\', mFile);
                fputc('n', mFile);
            }
            n += (lineLength + 1);
        }
        fputc('\"', mFile);
    }

    void AddObject(const char *name)
    {
        if (false == mFirstChild)
        {
            fputc(',', mFile);
        }

        if (NULL != name)
        {
            Indent();
            PrintName(name);
            fputc(':', mFile);
        }

        Indent();

        fputc('{', mFile);

        mIndentation += mIndentationStep;

        mFirstChild = true;
    }

    void AddObject(const char *name, const char *suffix)
    {
        if (false == mFirstChild)
        {
            fputc(',', mFile);
        }

        Indent();

        fputc('\"', mFile);
        fputs(name, mFile);
        fputs(suffix, mFile);
        fputs("\":", mFile);

        Indent();

        fputc('{', mFile);

        mIndentation += mIndentationStep;

        mFirstChild = true;
    }

    void CloseObject()
    {
        mIndentation -= mIndentationStep;

        mFirstChild = false;

        Indent();

        fputc('}', mFile);
    }

private:
    void Indent()
    {
        unsigned indentation = mIndentation;
        if (indentation)
        {
            fputc('\n', mFile);

            do
            {
                if (indentation < sizeof(mIndentationBuffer))
                {
                    fwrite(mIndentationBuffer, 1, indentation, mFile);
                    break;
                }
                else
                {
                    fwrite(mIndentationBuffer, 1, sizeof(mIndentationBuffer), mFile);
                    indentation -= sizeof(mIndentationBuffer);
                }
            }
            while (0 < indentation);
        }
    }

    void PrintName(const char *name)
    {
        fputc('\"', mFile);
        fputs(name, mFile);
        fputc('\"', mFile);
    }

    FILE *mFile;
    int   mIndentationStep;
    int   mIndentation;
    bool  mFirstChild;
    bool  mFirstValue;
    char  mIndentationBuffer[1024];
};

#endif // __JSON_H__
