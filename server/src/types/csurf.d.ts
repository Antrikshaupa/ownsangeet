declare module 'csurf' {
    import { RequestHandler } from 'express';

    interface CsrfOptions {
        cookie?: boolean | {
            key?: string;
            path?: string;
            httpOnly?: boolean;
            secure?: boolean;
            signed?: boolean;
            sameSite?: boolean | 'lax' | 'strict' | 'none';
            maxAge?: number;
            domain?: string;
        };
        ignoreMethods?: string[];
        sessionKey?: string;
        value?: (req: any) => string;
    }

    function csrf(options?: CsrfOptions): RequestHandler;

    export = csrf;
}
