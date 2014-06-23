
// Extra declarations for WebGL-related types.

interface HTMLCanvasElement {
	getContext(contextId: string, params : {}): WebGLRenderingContext;
    toDataURL(format?: string);

    ALLOW_KEYBOARD_INPUT?: any;

    webkitRequestFullScreenWithKeys?: () => void;
    requestFullScreenWithKeys?: () => void;
    webkitRequestFullScreen?: (flags?: any) => void;
    mozRequestFullScreen?: () => void;
    requestFullScreen?: () => void;
    requestFullscreen?: () => void;

}
