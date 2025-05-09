(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
        [974],
        {
          3662: (e, t, n) => {
            Promise.resolve().then(n.bind(n, 5288));
          },
          5288: (e, t, n) => {
            "use strict";
            n.d(t, { default: () => r });
            var o = n(2860),
              l = n(3200);
            let i = (e, t, n) => {
                for (let [o, l] of [
                  [-1, 0], [1, 0], [0, -1], [0, 1],
                  [-1, -1], [-1, 1], [1, -1], [1, 1],
                ]) {
                  let i = e + o, r = t + l;
                  if (i >= 0 && i < 5 && r >= 0 && r < 4 && "tiger" === n[i][r].content)
                    return !0;
                }
                return !1;
              },
              r = () => {
                let e = () => // 初始化 grid
                    [, , , , ,].fill(null).map((e, t) =>
                        [, , , ,].fill(null).map((e, n) => ({
                            id: 4 * t + n,
                            content: null,
                            isFertile: !0,
                            owner: null,
                            isDecaying: !1,
                            // isAffectedByHuman: !1, // 根据新逻辑，此属性不再需要
                        }))
                      ),
                  [t, n] = (0, l.useState)({ // 游戏状态
                    grid: e(),
                    oxygenLevel: 0,
                    plantCount: 0,
                    humanCount: 0,
                    tigerCount: 0,
                    woodCount: 0,
                    currentLevel: 1,
                    timeLeft: 120,
                    messages: ["欢迎来到生态保护游戏！"],
                    isGameOver: !1,
                  }),
                  [r, a] = (0, l.useState)(null), // 当前选择的物品
                  [c, s] = (0, l.useState)([]), // 历史记录，用于撤销
                  [d, u] = (0, l.useState)([]), // 已选择的木头ID
                  f = (0, l.useCallback)((e) => { // 添加消息
                    n((t) => ({ ...t, messages: [...t.messages.slice(-5), e] }));
                  }, []),
                  h = (0, l.useCallback)((e, t) => { // 处理火烧老虎
                    let n = t;
                    if (e.flat().filter((e) => "fire" === e.content).length >= 2) {
                      for (let t = 0; t < 5; t++)
                        for (let o = 0; o < 4; o++)
                          if ("tiger" === e[t][o].content) {
                            let l = 0;
                            for (let [n, i] of [[-1, 0],[1, 0],[0, -1],[0, 1],]) {
                              let r = t + n, a = o + i;
                              r >= 0 && r < 5 && a >= 0 && a < 4 && "fire" === e[r][a].content && l++;
                            }
                            if (l >= 2)
                              return ((e[t][o].content = "tiger-dead"),(e[t][o].isDecaying = !0),(n += " 两团火的热量消灭了一只老虎！"));
                          }
                    }
                    return n;
                  }, []),
                  g = (0, l.useCallback)((e) => { // 更新游戏状态（氧气、生物数量等）
                    let t = 0, o = 0, l = 0, i = 0, currentOxygen = 0; // 修改：r -> currentOxygen
                    e.flat().forEach((e) => {
                      "plant" === e.content && (t++, (currentOxygen += e.isFertile ? 10 : 1)); // 植物产氧
                      ("human" === e.content || "human" === e.owner) && o++;
                      "tiger" === e.content && l++;
                      "wood" === e.content && i++;
                    });
                    currentOxygen -= 5 * o; // **修改点：恢复人类直接消耗氧气**
                    currentOxygen = Math.max(0, Math.min(100, currentOxygen));
                    n((gameState) => ({ // 修改：n -> gameState
                      ...gameState,
                      plantCount: t,
                      humanCount: o,
                      tigerCount: l,
                      woodCount: i,
                      oxygenLevel: currentOxygen,
                      grid: e,
                    }));
                  }, []);
                (0, l.useEffect)(() => { // 处理人类因氧气死亡及生物风化
                  let e = t.grid.map((e) => e.map((e) => ({ ...e }))),
                    n = [], o = !1, l = !1;
                  e.flat().forEach((currentCell) => { // 修改：i -> currentCell
                    let r = Math.floor(currentCell.id / 4), a = currentCell.id % 4;
                    if ("human" === currentCell.content)
                      t.oxygenLevel < 20
                        ? (n.push("氧气浓度低于20%，人类窒息而亡！"), (e[r][a].content = "human-dead"), (e[r][a].isDecaying = !0), (o = !0))
                        : t.oxygenLevel > 30 && (n.push("氧气浓度高于30%，人类因含氧量超标死亡！"), (e[r][a].content = "human-dead"), (e[r][a].isDecaying = !0), (o = !0));
                    else if (("human-dead" === currentCell.content || "tiger-dead" === currentCell.content) && currentCell.isDecaying) {
                      let t = "human-dead" === currentCell.content ? "骸骨" : "老虎残骸";
                      (e[r][a].content = null), (e[r][a].isDecaying = !1), (o = !0), l || (n.push("一具".concat(t, "风化消失了。")), (l = !0));
                    }
                  });
                  n.length > 0 && n.forEach((e) => f(e));
                  o && g(e);
                }, [t.oxygenLevel, t.plantCount, t.grid, f, g]),
                  (0, l.useEffect)(() => { // 处理火熄灭变灰烬
                    let e = t.grid.map((e) => e.map((e) => ({ ...e }))), n = !1, o = Date.now();
                    e.flat().forEach((e) => { "fire" === e.content && e.fireEndTime && o >= e.fireEndTime && ((e.content = "ash"), (e.isFertile = !0), (e.fireEndTime = void 0), (n = !0), f("火焰熄灭了，留下了一片肥沃的草木灰土地。")); });
                    n && g(e);
                  }, [t.grid, f, g]),
                  (0, l.useEffect)(() => { // 第三关倒计时和洪水
                    let e_interval; // 修改变量名以避免与外部e冲突
                    if (3 === t.currentLevel && t.timeLeft > 0 && !t.isGameOver)
                      e_interval = setInterval(() => { n((gs) => ({ ...gs, timeLeft: gs.timeLeft - 1 })); }, 1e3); // 修改：e -> gs (gameState)
                    else if (3 === t.currentLevel && 0 === t.timeLeft && !t.isGameOver) {
                      f("120秒到！持续强降雨，引发大洪水！");
                      let newGrid = t.grid.map((row) => // 修改：e -> newGrid, e -> row
                        row.map((cell) => { // 修改：e -> cell
                          let tempCell = { ...cell }; // 修改：t -> tempCell, e -> cell
                          return (
                            "fire" === tempCell.content
                              ? ((tempCell.content = "ash"), (tempCell.isFertile = !0), (tempCell.fireEndTime = void 0))
                              : "ash" !== tempCell.content && ((tempCell.content = null), (tempCell.owner = null), "ash" !== cell.content && (tempCell.isFertile = !1)),
                            (tempCell.isDecaying = !1),
                            // tempCell.isAffectedByHuman = !1, // 根据新逻辑，此属性不再需要，但如果保留，洪水后也应重置
                            tempCell
                          );
                        })
                      );
                      n((gs) => ({ // 修改：t -> gs
                        ...gs,
                        grid: newGrid, // 修改：e -> newGrid
                        messages: [...gs.messages.slice(-5), "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。"],
                        woodCount: 0,
                      })),
                      g(newGrid); // 修改：e -> newGrid
                    }
                    return () => clearInterval(e_interval); // 修改：e -> e_interval
                  }, [t.currentLevel, t.timeLeft, t.isGameOver, f, g, t.grid]);
                let x = () => { // 保存历史
                    s((e) => [...e, JSON.parse(JSON.stringify(t))]);
                  },
                  m = (e_row, n_col) => { // 修改：e, n -> e_row, n_col (格子点击处理)
                    x(); // 保存当前状态到历史记录
                    let o_grid = t.grid.map((row) => row.map((cell) => ({ ...cell }))), // 修改：o -> o_grid, e -> row, e -> cell
                      l_cell = o_grid[e_row][n_col], // 修改：l -> l_cell
                      message = ""; // 修改：c -> message
                    if (r) { // 如果有选中的物品 (r 是 selectedItem)
                      if (null === l_cell.content || ("ash" === l_cell.content && "plant" === r)) {
                        if ("plant" === r)
                          l_cell.isFertile || "ash" === l_cell.content
                            ? ((l_cell.content = "plant"),
                              // l_cell.isAffectedByHuman = !1, // 根据新逻辑不再需要
                              (l_cell.isFertile = !0),
                              (message = "放置了 植物"),
                              a(null))
                            : (message = "土地贫瘠，植物无法生长！请先用火制造草木灰恢复地力。");
                        else if ("human" === r) {
                          if (((message = "放置了 人"), t.oxygenLevel < 20))
                            (message += "，但环境氧气浓度低于20%，人类窒息而亡！"), (l_cell.content = "human-dead"), (l_cell.isDecaying = !0);
                          else if (t.oxygenLevel > 30)
                            (message += "，但环境氧气浓度高于30%，人类因含氧量超标死亡！"), (l_cell.content = "human-dead"), (l_cell.isDecaying = !0);
                          else if (((l_cell.content = "human"), i(e_row, n_col, o_grid))) // i(e,n,o) 检查老虎
                            message += ", 附近有老虎威胁。"; // **修改点：人类放置成功，不直接消耗植物**
                          else {
                            // **修改点：移除消耗植物的逻辑**
                                // let e = o_grid.flat().filter(e => "plant" === e.content);
                                // if (e.length > 0) {
                                //     let t = e[Math.floor(Math.random() * e.length)];
                                //     o_grid[Math.floor(t.id / 4)][t.id % 4].content = "plant-dead",
                                //     message += ", 消耗了一株植物。";
                                // } else message += ", 但没有植物可消耗。";
                                message += "。"; // 确保提示信息连贯
                          }
                          a(null); // 清除当前选择
                        } else
                          "tiger" === r && ((l_cell.content = "tiger"), (message = "放置了 老虎"), a(null));
                      } else
                        "human" === r && "house" === l_cell.content && null === l_cell.owner
                          ? ((l_cell.owner = "human"), (message = "人住进了房子！"), a(null))
                          : (message = "这个格子已经被占用了或操作无效！");
                    } else if ("plant" === l_cell.content) // 点击植物
                      i(e_row, n_col, o_grid) // 附近有老虎
                        ? ((l_cell.content = "fire"), (l_cell.fireEndTime = Date.now() + 3e4), (message = h(o_grid, (message = "植物在老虎的威胁下被点燃了！"))))
                        : t.currentLevel >= 2 // 第二关及以后
                          ? ((l_cell.content = "wood"), (message = "植物变成了木头！收集4块木头可以建造房子。"))
                          : (message = "点击植物。在第二关及以后，植物可以转化为木头。");
                    else if ("wood" === l_cell.content && t.currentLevel >= 2) { // 点击木头
                      let e_woodId = l_cell.id; // 修改：e -> e_woodId
                      if (!d.includes(e_woodId)) {
                        let t_selectedWoods = [...d, e_woodId]; // 修改：t -> t_selectedWoods
                        if ((u(t_selectedWoods), (message = "选择了木头 (".concat(t_selectedWoods.length, "/4)。")), 4 === t_selectedWoods.length)) {
                          let e_housePlaced = !1; // 修改：e -> e_housePlaced
                          for (let r_row = 0; r_row < 5; r_row++) { // 修改：n -> r_row
                            for (let c_col = 0; c_col < 4; c_col++) // 修改：l -> c_col
                              if (null === o_grid[r_row][c_col].content || "ash" === o_grid[r_row][c_col].content) {
                                (o_grid[r_row][c_col].content = "house"),
                                (o_grid[r_row][c_col].isFertile = !0),
                                (message = "4块木头合成了一座房子！"),
                                t_selectedWoods.forEach((id_to_remove) => { // 修改：e -> id_to_remove
                                  o_grid[Math.floor(id_to_remove / 4)][id_to_remove % 4].content = null;
                                });
                                e_housePlaced = !0; break;
                              }
                            if (e_housePlaced) break;
                          }
                          e_housePlaced || (message = "没有空地建造房子！"), u([]);
                        }
                      }
                    } else
                      "plant-dead" === l_cell.content // 点击枯叶
                        ? ((l_cell.content = "fire"), (l_cell.fireEndTime = Date.now() + 3e4), (message = h(o_grid, (message = "枯叶被点燃，变成了火！"))))
                        : (message = "请先选择一个物品，或点击植物/枯叶进行转化。");
                    message && f(message); // 显示提示信息
                    let s_tigerEats = !1, // 修改：s -> s_tigerEats
                      m_gridAfterTiger = o_grid.map((row) => row.map((cell) => ({ ...cell }))); // 修改：m -> m_gridAfterTiger, e -> row, e -> cell
                    if (t.currentLevel >= 2) // 老虎吃人逻辑
                      for (let r_tiger_row = 0; r_tiger_row < 5; r_tiger_row++) { // 修改：e -> r_tiger_row
                        for (let c_tiger_col = 0; c_tiger_col < 4; c_tiger_col++) // 修改：t -> c_tiger_col
                          if ("tiger" === m_gridAfterTiger[r_tiger_row][c_tiger_col].content) {
                            let humanEaten = !1; // 修改：n -> humanEaten
                            for (let [dr, dc] of [[-1, 0],[1, 0],[0, -1],[0, 1],[-1, -1],[-1, 1],[1, -1],[1, 1],]) { // 修改：o,l -> dr,dc
                              let human_row = r_tiger_row + dr, human_col = c_tiger_col + dc; // 修改：i,r -> human_row, human_col
                              if (human_row >= 0 && human_row < 5 && human_col >= 0 && human_col < 4) {
                                let targetCell = m_gridAfterTiger[human_row][human_col]; // 修改：o -> targetCell
                                if ("human" === targetCell.content && !("human" === targetCell.owner && "house" === m_gridAfterTiger[human_row][human_col].content)) {
                                  (m_gridAfterTiger[human_row][human_col].content = "human-dead"),
                                  (m_gridAfterTiger[human_row][human_col].isDecaying = !0),
                                  f("老虎在(".concat(r_tiger_row + 1, ",").concat(c_tiger_col + 1, ")吃掉了(").concat(human_row + 1, ",").concat(human_col + 1, ")的人！")),
                                  (s_tigerEats = !0), (humanEaten = !0); break;
                                }
                              }
                            }
                            if (humanEaten) break;
                          }
                        if (s_tigerEats) break;
                      }
                    g(s_tigerEats ? m_gridAfterTiger : o_grid); // 更新 grid
                  },
                  p = (e_item) => { // 选择物品
                    a(e_item), u([]), f("选择了 ".concat("plant" === e_item ? "植物" : "human" === e_item ? "人" : "老虎"));
                  },
                  y = (e_cell) => // 根据格子内容获取图标
                    "plant" === e_cell.content ? "\uD83C\uDF3F"
                    : "plant-dead" === e_cell.content ? "\uD83C\uDF42"
                    : "human" === e_cell.content ? "\uD83E\uDDD1"
                    : "human-dead" === e_cell.content ? "\uD83D\uDC80"
                    : "tiger" === e_cell.content ? "\uD83D\uDC05"
                    : "tiger-dead" === e_cell.content ? "☠️"
                    : "fire" === e_cell.content ? "\uD83D\uDD25"
                    : "wood" === e_cell.content ? (d.includes(e_cell.id) ? "\uD83E\uDEB5✨" : "\uD83E\uDEB5")
                    : "house" === e_cell.content ? ("human" === e_cell.owner ? "\uD83C\uDFE0\uD83E\uDDD1" : "\uD83C\uDFE0")
                    : "ash" === e_cell.content ? "\uD83E\uDEA8" : "",
                  b = (e_cell) => { // 获取格子样式
                    let t_bgColor = "#D2B48C"; // 修改：t -> t_bgColor
                    return (
                      "fire" === e_cell.content ? (t_bgColor = "#ffcc80")
                      : "ash" === e_cell.content ? (t_bgColor = "#A9A9A9")
                      : e_cell.isFertile || (t_bgColor = "#E0C9A6"),
                      {
                        border: "1px solid #a5d6a7", backgroundColor: t_bgColor, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "2.5em",
                        cursor: "pointer", transition: "background-color 0.3s ease, transform 0.1s ease",
                        borderRadius: "4px", boxShadow: d.includes(e_cell.id) ? "0 0 5px 2px yellow" : "none",
                      }
                    );
                  },
                  v_buttonStyle = { padding: "10px 15px", fontSize: "1em", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", margin: "5px" }, // 修改：v -> v_buttonStyle
                  C_textStyle = { margin: "5px 0", fontSize: "0.9em", color: "black" }, // 修改：C -> C_textStyle
                  w_headerStyle = { color: "black", marginTop: "15px", flexShrink: 0 }, // 修改：w -> w_headerStyle
                  L_timerStyle = { textAlign: "center", color: t.timeLeft < 10 ? "red" : t.timeLeft < 60 ? "#f57c00" : "black", marginTop: "0", marginBottom: "10px", flexShrink: 0 }; // 修改：L -> L_timerStyle
                return (0, o.jsx)("div", {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", width: "100vw", padding: "0px", margin: "0px", boxSizing: "border-box", backgroundColor: "#001f3f" },
                  children: (0, o.jsxs)("div", {
                    style: { display: "flex", flexDirection: "row", backgroundColor: "#e0f2f1", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "100%", height: "100%", maxWidth: "1200px", maxHeight: "95vh", boxSizing: "border-box", overflow: "hidden" },
                    children: [
                      (0, o.jsxs)("div", {
                        style: { flexGrow: 1, marginRight: "20px", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "10px" },
                        children: [
                          (0, o.jsx)("h1", { style: { textAlign: "center", fontSize: "1.5em", color: "#2e7d32", marginBottom: "5px", flexShrink: 0 }, children: "创设氧气浓度适宜生物多样化的环境" }),
                          (0, o.jsxs)("h2", { style: { textAlign: "center", fontSize: "1.2em", color: "#4caf50", marginTop: "0", marginBottom: "10px", flexShrink: 0 }, children: ["当前关卡：", t.currentLevel] }),
                          3 === t.currentLevel && (0, o.jsxs)("h3", { style: L_timerStyle, children: ["倒计时: ", t.timeLeft, "s"] }),
                          (0, o.jsx)("div", {
                            style: { display: "grid", gridTemplateColumns: "repeat(".concat(4, ", 80px)"), gridTemplateRows: "repeat(".concat(5, ", 80px)"), gap: "5px", border: "2px solid #a5d6a7", margin: "20px auto", backgroundColor: "#c8e6c9", borderRadius: "8px", padding: "5px" },
                            children: t.grid.flat().map((cell_data) => // 修改：e -> cell_data
                              (0, o.jsx)("div", {
                                onClick: () => m(Math.floor(cell_data.id / 4), cell_data.id % 4),
                                style: b(cell_data),
                                title: cell_data.content || (cell_data.isFertile ? ("ash" === cell_data.content ? "草木灰土地" : "空地") : "贫瘠土地"),
                                onMouseEnter: (e) => (e.currentTarget.style.transform = "scale(1.05)"),
                                onMouseLeave: (e) => (e.currentTarget.style.transform = "scale(1)"),
                                children: y(cell_data),
                              }, cell_data.id)
                            ),
                          }),
                          (0, o.jsxs)("div", {
                            style: { textAlign: "center", marginTop: "20px", flexShrink: 0 },
                            children: [
                              (0, o.jsx)("button", { onClick: () => { c.length > 0 && (n(c[c.length - 1]), s(c.slice(0, -1)), u([]), f("操作已撤销")); }, style: v_buttonStyle, children: "撤销" }),
                              (0, o.jsx)("button", {
                                onClick: () => {
                                  x(); let newLevel = t.currentLevel < 3 ? t.currentLevel + 1 : 3; // 修改：o -> newLevel
                                  f(3 === t.currentLevel ? "重新开始关卡 ".concat(newLevel) : "进入关卡 ".concat(newLevel));
                                  n((gs) => ({ // 修改：t -> gs
                                    ...gs, currentLevel: newLevel, grid: e(), oxygenLevel: 0, plantCount: 0, humanCount: 0, tigerCount: 0, woodCount: 0, timeLeft: 120, isGameOver: !1, messages: ["欢迎来到关卡 ".concat(newLevel)]
                                  }));
                                  u([]), g(e());
                                },
                                style: { ...v_buttonStyle, marginLeft: "10px" },
                                children: 3 === t.currentLevel ? "重新开始当前关卡" : "进入下一关",
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, o.jsxs)("div", {
                        style: { width: "300px", paddingLeft: "20px", borderLeft: "1px solid #bcaaa4", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0, padding: "10px" },
                        children: [
                          (0, o.jsx)("h3", { style: w_headerStyle, children: "可选生物/物品:" }),
                          (0, o.jsx)("div", {
                            style: { marginBottom: "15px", flexShrink: 0 },
                            children: [
                              { name: "plant", label: "植物 \uD83C\uDF3F" },
                              { name: "human", label: "人 \uD83E\uDDD1" },
                              { name: "tiger", label: "老虎 \uD83D\uDC05" },
                            ].map((item_data) => // 修改：e -> item_data
                              (0, o.jsx)("button", {
                                onClick: () => p(item_data.name),
                                style: { padding: "10px", margin: "5px 0", width: "100%", fontSize: "1em", cursor: "pointer", backgroundColor: r === item_data.name ? "#a5d6a7" : "#fff", border: "1px solid #a5d6a7", borderRadius: "5px", color: "#333", textAlign: "left" },
                                children: item_data.label,
                              }, item_data.name)
                            ),
                          }),
                          (0, o.jsx)("h3", { style: w_headerStyle, children: "状态显示:" }),
                          (0, o.jsxs)("div", {
                            style: { marginBottom: "10px", flexShrink: 0 },
                            children: [
                              (0, o.jsxs)("p", { style: C_textStyle, children: ["氧气浓度: ", t.oxygenLevel, "%"] }),
                              (0, o.jsx)("div", {
                                style: { width: "100%", backgroundColor: "#ddd", borderRadius: "3px", height: "20px", overflow: "hidden" },
                                children: (0, o.jsx)("div", { style: { width: "".concat(t.oxygenLevel, "%"), backgroundColor: t.oxygenLevel < 20 || t.oxygenLevel > 30 ? "#f44336" : "#4caf50", height: "100%", borderRadius: "3px", transition: "width 0.5s ease-in-out" } }),
                              }),
                            ],
                          }),
                          (0, o.jsxs)("p", { style: C_textStyle, children: ["植物数量: ", t.plantCount, " \uD83C\uDF3F"] }),
                          (0, o.jsxs)("p", { style: C_textStyle, children: ["人类数量: ", t.humanCount, " \uD83E\uDDD1"] }),
                          (0, o.jsxs)("p", { style: C_textStyle, children: ["老虎数量: ", t.tigerCount, " \uD83D\uDC05"] }),
                          (0, o.jsxs)("p", { style: C_textStyle, children: ["木头数量: ", t.woodCount, " \uD83E\uDEB5"] }),
                          (0, o.jsx)("h3", { style: w_headerStyle, children: "信息提示:" }),
                          (0, o.jsx)("textarea", { readOnly: !0, value: t.messages.join("\n"), style: { width: "100%", minHeight: "100px", flexGrow: 1, border: "1px solid #a5d6a7", borderRadius: "5px", padding: "10px", fontSize: "0.9em", backgroundColor: "#f1f8e9", boxSizing: "border-box", resize: "none", color: "black" } }),
                        ],
                      }),
                    ],
                  }),
                });
              };
          },
        },
        (e) => {
          var t = (t) => e((e.s = t));
          e.O(0, [685, 411, 358], () => t(3662)), (_N_E = e.O());
        },
      ]);