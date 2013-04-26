// Copyright (c) 2011-2012 Turbulenz Limited

// Point: Simple 2d point class

class Point
{
    x = 0;
    y = 0;

    // Point constructor function
    static create(x, y)
    {
        var point = new Point();

        if (x)
        {
            point.x = x;
        }

        if (y)
        {
            point.y = y;
        }

        return point;
    };
};
