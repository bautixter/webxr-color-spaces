
// Shaders in three.js are just strings, so a neat way to store modules of shader logic
// is exporting functions as string snippets

export const colorSpaceFunctions = `

    // sRGB to HSV
    // ---------------------------------------------------------
    vec3 srgb_to_hsv(vec3 c) {
        float Cmax  = max(c.r, max(c.g, c.b));
        float Cmin  = min(c.r, min(c.g, c.b));
        float delta = Cmax - Cmin;

        float V = Cmax;
        float S = (Cmax < 1e-6) ? 0.0 : delta / Cmax;

        float H;
        if (delta < 1e-6) {
            H = 0.0;
        } else if (Cmax == c.r) {
            H = mod(60.0 * (c.g - c.b) / delta, 360.0);
        } else if (Cmax == c.g) {
            H = 60.0 * ((c.b - c.r) / delta + 2.0);
        } else {
            H = 60.0 * ((c.r - c.g) / delta + 4.0);
        }

        return vec3(H / 360.0, S, V);
    }

    // sRGB to Linear RGB
    // ---------------------------------------------------------
    vec3 srgb_to_linRGB(vec3 c) {
        vec3 linear = c / 12.92;
        vec3 gamma  = pow((c + 0.055) / 1.055, vec3(2.4));
        return mix(linear, gamma, step(0.04045, c));
    }

    // Linear RGB to CIE XYZ
    // ---------------------------------------------------------
    vec3 linRGB_to_XYZ (vec3 c){
        mat3 M = mat3(0.4124564, 0.2126729, 0.0193339,  // col 0
                      0.3575761, 0.7151522, 0.1191920,  // col 1
                      0.1804375, 0.0721750, 0.9503041); // col 2
        return(M * c);
    }

    // CIE XYZ to CIE xyY
    // ---------------------------------------------------------
    vec3 XYZ_to_xyY (vec3 c){
        float sum = max(c.x + c.y + c.z, 1e-6);
        float x = c.x / sum;
        float y = c.y / sum;
        float Y = c.y;
        return vec3(x, y, Y);
    }

    // CIE XYZ to CIELAB
    // ---------------------------------------------------------
    float lab_f(float t) {
        float delta  = 6.0 / 29.0;
        float cubic  = pow(max(t, 0.0), 1.0 / 3.0);
        float linear = t / (3.0 * delta * delta) + 4.0 / 29.0;
        return mix(linear, cubic, step(delta * delta * delta, t));
    }

    vec3 XYZ_to_Lab(vec3 c) {
        // D65 reference white
        vec3 white = vec3(0.95047, 1.00000, 1.08883);

        float fx = lab_f(c.x / white.x);
        float fy = lab_f(c.y / white.y);
        float fz = lab_f(c.z / white.z);

        float L = 116.0 * fy - 16.0;
        float a = 500.0 * (fx - fy);
        float b = 200.0 * (fy - fz);

        return vec3(L, a, b);
    }

    // CIELAB to CIELCH
    // ---------------------------------------------------------
    vec3 Lab_to_LCh(vec3 c) {
        float L = c.x;
        float C = sqrt(c.y * c.y + c.z * c.z);
        float h = atan(c.z, c.y);
        return vec3(L, C, h);
    }


    // Color changer function
    // ---------------------------------------------------------
    vec3 color_to_mode(vec3 c, int mode) {
        vec3 v;
        switch (mode) {
            case 1: return srgb_to_hsv(c);
            case 2:
                v = linRGB_to_XYZ(srgb_to_linRGB(c));
                return vec3(v.x / 0.95047, v.y / 1.00000, v.z / 1.08883); // normalize by D65 white
            case 3: return XYZ_to_xyY(linRGB_to_XYZ(srgb_to_linRGB(c)));
            case 4:
                v = XYZ_to_Lab(linRGB_to_XYZ(srgb_to_linRGB(c)));
                return vec3(v.x / 50.0 - 1.0,  // L*  → [-1,1]
                            v.y / 128.0,    // a*  → [-1,1]
                            v.z / 128.0);   // b*  → [-1,1]
            case 5:
                v = Lab_to_LCh(XYZ_to_Lab(linRGB_to_XYZ(srgb_to_linRGB(c))));
                return vec3(v.x / 100.0,
                            v.y / 181.02,
                            (v.z + 3.14159265) / (2.0 * 3.14159265));
            default: return c;
        }
    }
`;
