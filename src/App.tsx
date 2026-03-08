import React, { useState } from "react";
import { Plus, Play, Save, Trash2, Settings } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent } from "./components/ui/card";

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

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* 1. 上方虚线框：操作按钮组 */}
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center gap-4 bg-slate-50/50">
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="w-4 h-4" /> 保存配置
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Play className="w-4 h-4" /> 运行测试
        </Button>
        <Button variant="outline" size="sm" className="gap-2 text-destructive">
          <Trash2 className="w-4 h-4" /> 清空全部
        </Button>
      </div>

      {/* 2. 中间虚线框：添加按钮 */}
      <button
        onClick={addCard}
        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-12
                   hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-3"
      >
        <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
          <Plus className="w-8 h-8 text-slate-500 group-hover:text-primary" />
        </div>
        <span className="text-sm font-medium text-slate-500 group-hover:text-primary">
          点击添加新配置卡片
        </span>
      </button>

      {/* 3. 下方生成的卡片列表 */}
      <div className="space-y-4">
        {cards.map((id, index) => (
          <Card
            key={id}
            className="relative animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" /> 配置项目 #{index + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeCard(id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* 竖着排列的 div：左侧 Label 右侧 Input */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`name-${id}`} className="text-right">
                    项目名称
                  </Label>
                  <Input
                    id={`name-${id}`}
                    placeholder="请输入名称..."
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`type-${id}`} className="text-right">
                    配置类型
                  </Label>
                  <Input
                    id={`type-${id}`}
                    placeholder="例如：API / 数据库"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`val-${id}`} className="text-right">
                    参数值
                  </Label>
                  <Input
                    id={`val-${id}`}
                    placeholder="0.0.0.0"
                    className="col-span-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <p className="text-center text-slate-400 text-sm italic">
          暂无内容，请点击上方加号生成
        </p>
      )}
    </div>
  );
}
