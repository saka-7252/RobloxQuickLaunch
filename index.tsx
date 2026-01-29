import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";
import { OptionType } from "@utils/types";

const RobloxIcon = () => (
    <img 
        src="/assets/a4d8e9b0404a2d00.svg" 
        width="18" 
        height="18" 
        style={{ 
            filter: "brightness(0) invert(1)", 
            opacity: 0.8,
            verticalAlign: "middle"
        }} 
    />
);

const launchRoblox = (shareCode: string) => {
    const robloxUri = `roblox://navigation/share_links?code=${shareCode}&type=Server`;
    const win = window.open(robloxUri, "_blank");
    if (win) setTimeout(() => win.close(), 500);
    else window.location.assign(robloxUri);
};

export default definePlugin({
    name: "RobloxQuickLaunch",
    description: "Instantly launch Roblox from share links.",
    authors: [{ name: "saka", id: 960919219422232616n }],

    options: {
        autoLaunch: {
            name: "Auto Launch on Click",
            description: "Automatically launch Roblox when you left-click a share link.",
            type: OptionType.BOOLEAN,
            default: false,
        }
    },

    contextMenus: {
        "message": (children, { message }) => {
            const content = message?.content || (message as any)?.referencedMessage?.content || "";
            const codeMatch = content.match(/code=([a-f0-9]+)/);
            if (!codeMatch || !Array.isArray(children)) return;
            
            children.push(
                <Menu.MenuGroup>
                    <Menu.MenuItem 
                        id="roblox-direct-join" 
                        label="Launch Roblox" 
                        icon={RobloxIcon}
                        action={() => launchRoblox(codeMatch[1])} 
                    />
                </Menu.MenuGroup>
            );
        }
    },

    start() {
        window.addEventListener("click", (e: MouseEvent) => {
            // @ts-ignore
            const settings = window.Vencord?.Settings?.plugins?.RobloxQuickLaunch || this.settings;
            if (!settings?.autoLaunch) return;

            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href.includes("roblox.com/share")) {
                const codeMatch = anchor.href.match(/code=([a-f0-9]+)/);
                if (codeMatch) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    launchRoblox(codeMatch[1]);
                }
            }
        }, { capture: true });
    }
});