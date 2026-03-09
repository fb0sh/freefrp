import { useState } from "react";
import { saveAs } from "file-saver"; // pnpm add file-saver
import { toast } from "sonner"; // shadcn 的 sonner
import {
  Plus,
  Trash2,
  Terminal,
  Code2,
  Copy,
  Download,
  Upload,
  Zap,
  Settings,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TunnelConfig {
  id: number;
  name: string;
  localPort: string;
  protocol: string;
  remotePort: string;
  host: string;
  customDomains?: string;
  subdomain?: string;
}

export default function ConfigPage() {
  const [tunnels, setTunnels] = useState<TunnelConfig[]>([]);

  // --- 核心业务逻辑 ---

  const generateTOML = () => {
    let toml = `serverAddr = "frp.freefrp.net"\nserverPort = 7000\nauth.method = "token"\nauth.token = "freefrp.net"\n`;
    tunnels.forEach((t) => {
      const isWeb = t.protocol === "http" || t.protocol === "https";
      const suffix = `_${t.localPort || "0"}-${isWeb ? t.protocol : t.remotePort || "0"}`;
      const finalName = `${t.name || "service"}${suffix}`;

      toml += `\n[[proxies]]\nname = "${finalName}"\ntype = "${t.protocol}"\nlocalIP = "${t.host}"\nlocalPort = ${t.localPort || 80}\n`;

      if (isWeb) {
        if (t.customDomains) toml += `customDomains = ["${t.customDomains}"]\n`;
        if (t.subdomain) toml += `subdomain = "${t.subdomain}"\n`;
      } else {
        toml += `remotePort = ${t.remotePort || 0}\n`;
      }
    });
    return toml;
  };

  const handleExport = () => {
    if (tunnels.length === 0) return toast.error("配置列表为空");
    const blob = new Blob([generateTOML()], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "frpc.toml");
    toast.success("frpc.toml 已开始下载");
  };

  const handleCopy = (type: "toml" | "base64") => {
    if (tunnels.length === 0) return toast.error("配置列表为空");
    const content = generateTOML();
    const result =
      type === "base64" ? btoa(unescape(encodeURIComponent(content))) : content;

    navigator.clipboard.writeText(result).then(() => {
      toast.success(`${type.toUpperCase()} 内容已复制`);
    });
  };

  const handleImport = () => {
    const input = prompt("请粘贴 TOML 内容或 Base64 字符串：");
    if (!input) return;

    try {
      let content = input.trim();
      if (!content.includes("[") && !content.includes("serverAddr")) {
        content = decodeURIComponent(escape(atob(content)));
      }

      const proxyBlocks = content.split("[[proxies]]").slice(1);
      if (proxyBlocks.length === 0) throw new Error();

      const imported = proxyBlocks.map((block, i) => {
        const get = (key: string) => {
          const reg = new RegExp(
            `${key}\\s*=\\s*(?:\\["|")([^"\\]\\n]+)(?:"\\]|")`,
          );
          return block.match(reg)?.[1] || "";
        };

        const fullName = get("name");
        return {
          id: Date.now() + i,
          name: fullName.split("_")[0] || "",
          localPort: get("localPort"),
          protocol: get("type") || "tcp",
          remotePort: get("remotePort"),
          host: get("localIP") || "127.0.0.1",
          customDomains: get("customDomains"),
          subdomain: get("subdomain"),
        };
      });

      setTunnels((prev) => [...prev, ...imported]);
      toast.success(`成功导入 ${imported.length} 个配置项`);
    } catch {
      toast.error("解析失败，请检查配置格式");
    }
  };

  // --- UI 交互逻辑 ---

  const addCard = () => {
    const randomPort = Math.floor(Math.random() * (50000 - 10001 + 1)) + 10001;
    const newTunnel: TunnelConfig = {
      id: Date.now(),
      name: ``,
      localPort: "",
      protocol: "tcp",
      remotePort: randomPort.toString(),
      host: "127.0.0.1",
    };
    setTunnels([...tunnels, newTunnel]);
    toast.success("已添加隧道", {
      description: `随机分配远程端口: ${randomPort}`,
    });
  };

  const updateTunnel = (
    id: number,
    field: keyof TunnelConfig,
    value: string,
  ) => {
    setTunnels((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const removeCard = (id: number) => {
    setTunnels(tunnels.filter((t) => t.id !== id));
    toast.info("配置已移除");
  };
  const clearAll = () => {
    if (tunnels.length > 0 && confirm("确定要清空所有隧道配置吗？")) {
      setTunnels([]);
      toast.success("所有配置已清空");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
      {/* 标题部分 - 已完整还原 */}
      <div className="flex flex-col gap-1 border-l-4 border-primary pl-4 py-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          FREE FRP{" "}
          <span className="text-primary/60 font-light">在线配置工具</span>
          <Zap className="w-5 h-5 fill-primary text-primary animate-pulse" />
        </h1>
        <div className="text-sm text-slate-500 font-medium">
          <p className="text-sm text-slate-500 font-medium">
            服务支持网站：
            <a
              href="https://freefrp.net/"
              className="hover:underline"
              target="_blank"
            >
              https://freefrp.net/
            </a>
            <br />
            工具下载网站：
            <a
              href="https://github.com/fatedier/frp/releases"
              className="hover:underline"
              target="_blank"
            >
              https://github.com/fatedier/frp/releases
            </a>
          </p>
        </div>
      </div>

      {/* 顶部控制台 - 已完整还原 */}
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/40 flex flex-col lg:flex-row items-stretch justify-between gap-8 transition-all hover:bg-slate-50/60">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              frpc.toml
            </span>
          </div>
          <div className="bg-slate-950 rounded-xl p-5 font-mono text-[13px] leading-relaxed shadow-2xl border border-white/5 relative overflow-hidden group">
            <Terminal className="absolute -bottom-2 -right-2 w-16 h-16 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-1.5 text-yellow-200/90">
              <div className="flex gap-3">
                <span className="text-slate-600">01</span>
                <p className="text-emerald-500/80">
                  # 当前隧道总数: {tunnels.length}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">02</span>
                <p>
                  <span className="text-slate-500">serverAddr =</span>{" "}
                  "frp.freefrp.net"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">03</span>
                <p>
                  <span className="text-slate-500">serverPort =</span> 7000
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">04</span>
                <p>
                  <span className="text-slate-500">auth.method =</span> "token"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">05</span>
                <p>
                  <span className="text-slate-500">auth.token =</span>{" "}
                  "freefrp.net"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">06</span>
                <p className="text-emerald-500/80"># 端口范围：10001 - 50000</p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">07</span>
                <p className="text-emerald-500/80">
                  # 启动隧道：frpc -c config.toml
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">08</span>
                <p className="text-emerald-500/80">
                  # 注：配置文件中 隧道的名称会根据端口自动生成，避免重复
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 按钮区域 - 已完整还原 */}
        <div className="flex flex-wrap md:grid md:grid-cols-2 lg:flex lg:flex-col justify-center gap-3 shrink-0">
          <div className="contents lg:space-y-2">
            <Button
              onClick={handleExport}
              className="h-10 gap-2 shadow-md w-full lg:w-40 justify-start px-4 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" /> 导出 TOML
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopy("toml")}
              className="h-10 gap-2 bg-white border shadow-sm w-full md:w-auto lg:w-40 justify-start px-4 active:scale-95 transition-all hover:bg-slate-50"
            >
              <Copy className="w-4 h-4 text-blue-500" /> 复制 TOML
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopy("base64")}
              className="h-10 gap-2 bg-white border shadow-sm w-full md:w-auto lg:w-40 justify-start px-4 active:scale-95 hover:bg-slate-50 transition-all"
            >
              <Copy className="w-4 h-4 text-blue-500" /> 复制 BASE64
            </Button>
          </div>
          <div className="contents lg:space-y-2 lg:pt-3 lg:border-t lg:border-slate-200">
            <Button
              variant="outline"
              onClick={handleImport}
              className="h-10 gap-2 bg-white shadow-sm w-full lg:w-40 justify-start px-4 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
            >
              <Upload className="w-4 h-4 text-emerald-500" /> 导入 TOML
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              className="h-10 gap-2 bg-white shadow-sm w-full lg:w-40 justify-start px-4 text-destructive hover:bg-red-50 border-red-100 transition-all"
            >
              <Trash2 className="w-4 h-4" /> 清空全部
            </Button>
          </div>
        </div>
      </div>

      {/* 添加卡片按钮 - 已完整还原 */}
      <button
        onClick={addCard}
        className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-primary/40 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-3"
      >
        <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
          <Plus className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">
            新建隧道配置
          </p>
          <p className="text-xs text-slate-400 mt-1">
            随机分配端口 (10001-50000)
          </p>
        </div>
      </button>

      {/* 隧道列表 */}
      <div className="grid grid-cols-1 gap-5">
        {tunnels.map((tunnel, index) => {
          const isWeb =
            tunnel.protocol === "http" || tunnel.protocol === "https";
          return (
            <Card
              key={tunnel.id}
              className="group relative shadow-sm border-slate-200 hover:shadow-xl hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
            >
              <CardContent className="p-5 space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      {isWeb ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Code2 className="w-4 h-4" />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-700">
                      隧道配置 #{index + 1}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-300 hover:text-destructive hover:bg-red-50 rounded-full"
                    onClick={() => removeCard(tunnel.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid gap-4 text-sm">
                  <div className="flex items-center gap-4">
                    <Label className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                      隧道名称
                    </Label>
                    <div className="flex flex-1 items-center">
                      <Input
                        value={tunnel.name}
                        onChange={(e) =>
                          updateTunnel(tunnel.id, "name", e.target.value)
                        }
                        placeholder="service"
                        className="h-10 rounded-r-none border-r-0 focus-visible:ring-0 focus:bg-white transition-all"
                      />
                      <div className="h-10 px-3 flex items-center bg-slate-100 border border-l-0 border-slate-200 rounded-r-md text-slate-400 font-mono text-[11px] whitespace-nowrap select-none">
                        _{tunnel.localPort || "0"}-
                        {isWeb ? tunnel.protocol : tunnel.remotePort || "0"}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <Label className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                        本地端口
                      </Label>
                      <Input
                        value={tunnel.localPort}
                        onChange={(e) =>
                          updateTunnel(tunnel.id, "localPort", e.target.value)
                        }
                        placeholder="80"
                        className="h-10 bg-slate-50/50 border-transparent focus:bg-white font-mono font-bold text-primary"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-12 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                        协议
                      </Label>
                      <Select
                        value={tunnel.protocol}
                        onValueChange={(v) =>
                          updateTunnel(tunnel.id, "protocol", v)
                        }
                      >
                        <SelectTrigger className="h-10 bg-slate-50/50 border-transparent focus:bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tcp">TCP</SelectItem>
                          <SelectItem value="udp">UDP</SelectItem>
                          <SelectItem value="http">HTTP</SelectItem>
                          <SelectItem value="https">HTTPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 条件展示字段 */}
                  {isWeb ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                          <Label className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                            自定义域名
                          </Label>
                          <Input
                            value={tunnel.customDomains || ""}
                            onChange={(e) =>
                              updateTunnel(
                                tunnel.id,
                                "customDomains",
                                e.target.value,
                              )
                            }
                            placeholder="example.com"
                            className="h-10 bg-slate-50/50 border-transparent focus:bg-white font-mono font-bold text-primary"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label className="w-12 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                            子域名
                          </Label>
                          <Input
                            value={tunnel.subdomain || ""}
                            onChange={(e) =>
                              updateTunnel(
                                tunnel.id,
                                "subdomain",
                                e.target.value,
                              )
                            }
                            placeholder="sub"
                            className="h-10 bg-slate-50/50 border-transparent focus:bg-white font-mono font-bold text-primary"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                          本地主机
                        </Label>
                        <Input
                          value={tunnel.host}
                          onChange={(e) =>
                            updateTunnel(tunnel.id, "host", e.target.value)
                          }
                          className="h-10 bg-slate-50/50 border-transparent focus:bg-white font-mono font-bold text-primary flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        <Label className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                          远程端口
                        </Label>
                        <Input
                          value={tunnel.remotePort}
                          onChange={(e) =>
                            updateTunnel(
                              tunnel.id,
                              "remotePort",
                              e.target.value,
                            )
                          }
                          placeholder="20001"
                          className="h-10 bg-slate-50/50 border-transparent focus:bg-white font-mono font-bold text-primary"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="w-12 text-right shrink-0 text-slate-400 font-bold uppercase text-[11px]">
                          主机
                        </Label>
                        <Input
                          value={tunnel.host}
                          onChange={(e) =>
                            updateTunnel(tunnel.id, "host", e.target.value)
                          }
                          className="h-10 bg-slate-50/50 border-transparent focus:bg-white font-mono font-bold text-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tunnels.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/20">
          <Settings className="w-10 h-10 text-slate-200 animate-spin-slow mb-4" />
          <p className="text-slate-400 text-sm">暂无活跃隧道</p>
        </div>
      )}
    </div>
  );
}
