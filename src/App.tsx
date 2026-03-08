import React, { useState } from "react";

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

export default function ConfigPage() {
  const [cards, setCards] = useState<number[]>([]);

  // 添加新卡片
  const addCard = () => {
    setCards([...cards, Date.now()]);
  };

  // 删除指定卡片
  const removeCard = (id: number) => {
    setCards(cards.filter((cardId) => cardId !== id));
  };

  // 清空所有卡片
  const clearAll = () => {
    if (cards.length > 0 && confirm("确定要清空所有隧道配置吗？")) {
      setCards([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
      {/* --- 标题部分 --- */}
      <div className="flex flex-col gap-1 border-l-4 border-primary pl-4 py-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          FREE FRP <span className="text-primary/60 font-light">在线配置</span>
          <Zap className="w-5 h-5 fill-primary text-primary animate-pulse" />
        </h1>
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

      {/* --- 顶部控制台：配置预览 + 操作按钮 --- */}
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/40 flex flex-col lg:flex-row items-stretch justify-between gap-8 transition-all hover:bg-slate-50/60">
        {/* 左侧：实时配置预览区 */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              frpc.toml
            </span>
          </div>
          <div className="bg-slate-950 rounded-xl p-5 font-mono text-[13px] leading-relaxed shadow-2xl border border-white/5 relative overflow-hidden group">
            <Terminal className="absolute -bottom-2 -right-2 w-16 h-16 text-white/5 rotate-12 group-hover:text-white/10 transition-colors" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex gap-3">
                <span className="text-slate-600">01</span>
                <p className="text-emerald-500/80">
                  # 当前隧道总数: {cards.length}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">02</span>
                <p className="text-yellow-200/90">
                  <span className="text-slate-500">serverAddr =</span>{" "}
                  "frp.freefrp.net"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">03</span>
                <p className="text-yellow-200/90">
                  <span className="text-slate-500">serverPort =</span> 7000
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">03</span>
                <p className="text-yellow-200/90">
                  <span className="text-slate-500">auth.method =</span> "token"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">04</span>
                <p className="text-yellow-200/90">
                  <span className="text-slate-500">auth.token =</span>{" "}
                  "freefrp.net"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">05</span>
                <p className="text-emerald-500/80"># 端口范围：10001 - 50000</p>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">06</span>
                <p className="text-emerald-500/80">
                  # 启动隧道：frpc -c config.toml
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：功能按钮区 */}
        <div className="flex flex-wrap md:grid md:grid-cols-2 lg:flex lg:flex-col justify-center gap-3 shrink-0">
          {/* 分组 1: 数据产出 */}
          <div className="contents lg:space-y-2">
            <Button
              variant="default"
              size="sm"
              className="h-10 gap-2 shadow-md w-full md:w-auto lg:w-40 justify-start px-4 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>导出 TOML</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-10 gap-2 bg-white border shadow-sm w-full md:w-auto lg:w-40 justify-start px-4 transition-all active:scale-95 hover:bg-slate-50"
            >
              <Copy className="w-4 h-4 text-blue-500" />
              <span>复制 TOML</span>
            </Button>
          </div>

          {/* 分组 2: 管理功能 */}
          <div className="contents lg:space-y-2 lg:pt-3 lg:border-t lg:border-slate-200">
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 bg-white shadow-sm w-full md:w-auto lg:w-40 justify-start px-4 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>导入TOML</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="h-10 gap-2 bg-white shadow-sm w-full md:w-auto lg:w-40 justify-start px-4 text-destructive hover:bg-red-50 hover:text-red-600 border-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>清空全部</span>
            </Button>
          </div>
        </div>
      </div>

      {/* --- 快捷添加按钮 --- */}
      <button
        onClick={addCard}
        className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8
                   hover:border-primary/40 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-3"
      >
        <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
          <Plus className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">
            新建隧道配置
          </p>
          <p className="text-xs text-slate-400 mt-1">
            点击按钮添加 TCP / UDP 隧道
          </p>
        </div>
      </button>

      {/* --- 动态卡片列表 --- */}
      <div className="grid grid-cols-1 gap-5">
        {cards.map((id, index) => (
          <Card
            key={id}
            className="group relative shadow-sm border-slate-200 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
          >
            <CardContent className="p-5 space-y-5">
              {/* 卡片头部 */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">
                    隧道映射配置 #{index + 1}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-300 hover:text-destructive hover:bg-red-50 rounded-full transition-colors"
                  onClick={() => removeCard(id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* 卡片表单区域 */}
              <div className="grid gap-4 text-sm">
                {/* 隧道名称 */}
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor={`name-${id}`}
                    className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase tracking-tighter text-[11px]"
                  >
                    隧道名称
                  </Label>
                  <Input
                    id={`name-${id}`}
                    placeholder="例如: web-service"
                    className="h-10 bg-slate-50/50 border-transparent focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* 本地端口 + 协议 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <Label className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase tracking-tighter text-[11px]">
                      本地端口
                    </Label>
                    <Input
                      placeholder="80"
                      className="h-10 bg-slate-50/50 border-transparent focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-12 text-right shrink-0 text-slate-400 font-bold uppercase tracking-tighter text-[11px]">
                      协议
                    </Label>
                    <Select defaultValue="tcp">
                      <SelectTrigger className="h-10 bg-slate-50/50 border-transparent focus:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 远程端口 + 目标主机 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <Label className="w-20 text-right shrink-0 text-slate-400 font-bold uppercase tracking-tighter text-[11px]">
                      远程端口
                    </Label>
                    <Input
                      placeholder="20001"
                      className="h-10 bg-slate-50/50 border-transparent focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-12 text-right shrink-0 text-slate-400 font-bold uppercase tracking-tighter text-[11px]">
                      主机
                    </Label>
                    <Input
                      defaultValue="127.0.0.1"
                      className="h-10 bg-slate-50/50 border-transparent focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- 缺省页 --- */}
      {cards.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/20">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Settings className="w-10 h-10 text-slate-200 animate-spin-slow" />
          </div>
          <h3 className="text-slate-900 font-bold">暂无活跃隧道</h3>
          <p className="text-slate-400 text-sm mt-1">
            请通过上方的加号按钮开始你的配置
          </p>
        </div>
      )}

      {/* --- 页脚 --- */}
      <footer className="pt-8 text-center text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase">
        Designed for FreeFRP Community
      </footer>
    </div>
  );
}
