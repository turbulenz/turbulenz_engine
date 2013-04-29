
// ArrayBuffer
interface ArrayBuffer
{
    slice(begin: number, end?: number): ArrayBuffer;
};

// Uint8ClampedArray
interface Uint8ClampedArray extends Uint8Array
{
};
declare var Uint8ClampedArray:
{
    prototype: Uint8Array;
    new (length: number): Uint8Array;
    new (array: Uint8Array): Uint8Array;
    new (array: number[]): Uint8Array;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8Array;
    BYTES_PER_ELEMENT: number;
};

interface Float32Array
{
    slice(s: number, e: number): Float32Array; // defined in vmath
    map(offset: number, numFloats: number): void;
    unmap(): void;
    setData(data, offset?: number, numFloats?: number): void;
};

// HTMLImageElement
interface HTMLImageElement
{
    crossOrigin: string;
};

// Window
interface Window
{
    XMLHttpRequest:
    {
        prototype: XMLHttpRequest;
        new (): XMLHttpRequest;
        LOADING: number;
        DONE: number;
        UNSENT: number;
        OPENED: number;
        HEADERS_RECEIVED: number;
    };

    ActiveXObject:
    {
        new (s: string): any;
    };

    WebSocket: {
        prototype: WebSocket;
        new (url: string): WebSocket;
        new (url: string, prototcol: string): WebSocket;
        new (url: string, prototcol: string[]): WebSocket;
        OPEN: number;
        CLOSING: number;
        CONNECTING: number;
        CLOSED: number;
    };
    MozWebSocket: {
        prototype: WebSocket;
        new (url: string): WebSocket;
        new (url: string, prototcol: string): WebSocket;
        new (url: string, prototcol: string[]): WebSocket;
        OPEN: number;
        CLOSING: number;
        CONNECTING: number;
        CLOSED: number;
    };

    AudioContext: any;
    webkitAudioContext: any;

    opera: bool;
};

// Document
interface Document
{
    webkitCancelFullScreen?: { () : void; };
    cancelFullScreen?: { (): void; };
    exitFullscreen?: { (): void; };

    fullscreenEnabled?: bool;
    mozFullScreen?: bool;
    webkitIsFullScreen?: bool;

    pointerLockElement?: any;
    mozPointerLockElement?: any;
    webkitPointerLockElement?: any;

    requestPointerLock?: { (element?: any) : void; };
    mozRequestPointerLock?: { (element?: any): void; };
    webkitRequestPointerLock?: { (element?: any): void; };

    exitPointerLock?: { (element?: any) : void; };
    mozExitPointerLock?: { (element?: any) : void; };
    webkitExitPointerLock?: { (element?: any) : void; };

};

// Navigator
interface Navigator
{
    gamepads?: any[];
    webkitGamepads?: any[];
    webkitGetGamepads?: { (): any[]; };

    pointer: // TODO: Where is this type documented?
    {
        isLocked: bool;
        lock(any): void;
        unlock(): void;
    };
    webkitPointer:
    {
        isLocked: bool;
        lock(any): void;
        unlock(): void;
    };

    language: string;
};

interface HTMLVideoElement
{
    webkitDecodedFrameCount: number;
    crossorigin: string;

    //canPlayType(type: string): bool
};

interface HTMLAudioElement
{
    mozSetup(channels: number, sampleRate: number);
};

interface WebGLVideo
{
    elementAdded: bool;
};
