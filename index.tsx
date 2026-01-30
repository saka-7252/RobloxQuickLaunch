import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";
import { OptionType } from "@utils/types";

const RobloxIcon = () => (
    <img 
        src="/assets/a4d8e9b0404a2d00.svg" 
        width="18" 
        height="18" 
        style={{ filter: "brightness(0) invert(1)", opacity: 0.8, verticalAlign: "middle" }} 
    />
);

const getRobloxUri = (url: string) => {
    if (!url) return null;
    const ps = url.match(/games\/(\d+)/);
    const lc = url.match(/privateServerLinkCode=(\d+)/);
    if (ps && lc) return `roblox://placeId=${ps[1]}&linkCode=${lc[1]}`;

    const sh = url.match(/code=([a-f0-9]+)/);
    if (sh && url.includes("roblox.com/share")) return `roblox://navigation/share_links?code=${sh[1]}&type=Server`;

    return null;
};

const launchRoblox = (uri: string) => {
    const win = window.open(uri, "_blank");
    if (win) setTimeout(() => win.close(), 500);
    else window.location.assign(uri);
};

export default definePlugin({
    name: "RobloxQuickLaunch",
    description: "Instantly launch Roblox from share and private server links.",
    authors: [{ name: "saka", id: 960919219422232616n }],

    options: {
        autoLaunch: {
            name: "Auto Launch on Click",
            description: "Automatically launch Roblox when you left-click a share or private link.",
            type: OptionType.BOOLEAN,
            default: false,
        }
    },

    contextMenus: {
        "message": (children, { message }) => {
            const content = message?.content || (message as any)?.referencedMessage?.content || "";
            const uri = getRobloxUri(content);
            if (!uri || !Array.isArray(children)) return;
            
            children.push(
                <Menu.MenuGroup>
                    <Menu.MenuItem 
                        id="roblox-direct-join" 
                        label="Launch Roblox" 
                        icon={RobloxIcon}
                        action={() => launchRoblox(uri)} 
                    />
                </Menu.MenuGroup>
            );
        }
    },

    start() {
        window.addEventListener("click", (e: MouseEvent) => {
            const settings = (window as any).Vencord?.Settings?.plugins?.RobloxQuickLaunch || (this as any).settings;
            if (!settings?.autoLaunch) return;

            const anchor = (e.target as HTMLElement).closest("a");
            if (!anchor) return;

            const uri = getRobloxUri(anchor.href);
            if (uri) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                launchRoblox(uri);
            }
        }, { capture: true });
    }
});
