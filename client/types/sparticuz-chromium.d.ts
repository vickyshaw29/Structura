declare module '@sparticuz/chromium' {
    const chromium: {
      args: string[];
      defaultViewport: { width: number; height: number } | null;
      executablePath: () => Promise<string>;
      headless: boolean;
      isDev: boolean;
      font: (path: string) => void;
    };
  
    export default chromium;
  }
  