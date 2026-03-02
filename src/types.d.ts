interface RoamAlphaAPI {
    ui: {
        getFocusedBlock: () => any;
        setBlockFocusAndSelection: (args: any) => any;
        rightSidebar: {
            addWindow: (args: any) => any;
        };
        commandPalette: {
            addCommand: (args: any) => any;
            removeCommand: (args: any) => any;
        };
    };
    data: {
        q: (query: string, ...args: any[]) => any;
        page: {
            create: (args: any) => Promise<any>;
        };
        block: {
            create: (args: any) => Promise<any>;
        };
    };
    util: {
        generateUID: () => string;
    };
}

interface Window {
    roamAlphaAPI: RoamAlphaAPI;
}
