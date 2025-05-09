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
            let i = (e, t, n) => { // 检查老虎威胁的函数
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
              r = () => { // 游戏主组件
                let e = () => // 初始化 grid
                    [, , , , ,].fill(null).map((e, t) =>
                        [, , , ,].fill(null).map((e, n) => ({
                            id: 4 * t + n,
                            content: null,
                            isFertile: !0, // 默认土地肥沃
                            owner: null,
                            isDecaying: !1,
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
                  [r_selectedItem, setSelectedItem] = (0, l.useState)(null), // 修改：r -> r_selectedItem, a -> setSelectedItem
                  [c_history, setHistory] = (0, l.useState)([]), // 修改：c -> c_history, s -> setHistory
                  [d_selectedWoods, setSelectedWoods] = (0, l.useState)([]), // 修改：d -> d_selectedWoods, u -> setSelectedWoods
                  f_addMessage = (0, l.useCallback)((messageText) => { // 修改：f -> f_addMessage, e -> messageText
                    n((currentGameState) => ({ ...currentGameState, messages: [...currentGameState.messages.slice(-5), messageText] })); // 修改：t -> currentGameStage
                  }, []),
                  h_handleFireEffect = (0, l.useCallback)((currentGrid, messageLog) => { // 修改：h -> h_handleFireEffect, e -> currentGrid, t -> messageLog
                    let newMessageLog = messageLog; // 修改：n -> newMessageLog
                    if (currentGrid.flat().filter((cell) => "fire" === cell.content).length >= 2) { // 修改：e -> cell
                      for (let r_idx = 0; r_idx < 5; r_idx++) // 修改：t -> r_idx
                        for (let c_idx = 0; c_idx < 4; c_idx++) // 修改：o -> c_idx
                          if ("tiger" === currentGrid[r_idx][c_idx].content) {
                            let fireSources = 0; // 修改：l -> fireSources
                            for (let [dr, dc] of [[-1, 0],[1, 0],[0, -1],[0, 1],]) { // 修改：n,i -> dr,dc
                              let adj_r = r_idx + dr, adj_c = c_idx + dc; // 修改：r,a -> adj_r, adj_c
                              adj_r >= 0 && adj_r < 5 && adj_c >= 0 && adj_c < 4 && "fire" === currentGrid[adj_r][adj_c].content && fireSources++;
                            }
                            if (fireSources >= 2)
                              return ((currentGrid[r_idx][c_idx].content = "tiger-dead"),(currentGrid[r_idx][c_idx].isDecaying = !0),(newMessageLog += " 两团火的热量消灭了一只老虎！"));
                          }
                    }
                    return newMessageLog;
                  }, []),
                  g_updateGameState = (0, l.useCallback)((currentGrid_g) => { // 修改：g -> g_updateGameState, e -> currentGrid_g
                    let plant_count_g = 0, human_count_g = 0, tiger_count_g = 0, wood_count_g = 0, oxygen_level_g = 0; // 修改：t,o,l,i,r -> _g suffixed variables
                    currentGrid_g.flat().forEach((cell_g) => { // 修改：e -> cell_g
                      "plant" === cell_g.content && (plant_count_g++, (oxygen_level_g += cell_g.isFertile ? 10 : 1));
                      ("human" === cell_g.content || "human" === cell_g.owner) && human_count_g++;
                      "tiger" === cell_g.content && tiger_count_g++;
                      "wood" === cell_g.content && wood_count_g++;
                    });
                    oxygen_level_g -= 5 * human_count_g; // **人类固定消耗5%氧气**
                    oxygen_level_g = Math.max(0, Math.min(100, oxygen_level_g));
                    n((current_gs) => ({ // 修改：n -> current_gs (current_gameState)
                      ...current_gs,
                      plantCount: plant_count_g,
                      humanCount: human_count_g,
                      tigerCount: tiger_count_g,
                      woodCount: wood_count_g,
                      oxygenLevel: oxygen_level_g,
                      grid: currentGrid_g,
                    }));
                  }, []);
                (0, l.useEffect)(() => { // 处理人类因氧气死亡及生物风化
                  let e_gridCopy = t.grid.map((row) => row.map((cell) => ({ ...cell }))), // 修改：e->e_gridCopy, e->row, e->cell
                    messages_arr = [], changed_flag = !1, decayingMessageShown_flag = !1; // 修改：n,o,l -> descriptive names
                  e_gridCopy.flat().forEach((cell_in_effect) => { // 修改：i -> cell_in_effect
                    let r_eff = Math.floor(cell_in_effect.id / 4), a_eff = cell_in_effect.id % 4; // 修改：r,a -> r_eff, a_eff
                    if ("human" === cell_in_effect.content)
                      t.oxygenLevel < 20
                        ? (messages_arr.push("氧气浓度低于20%，人类窒息而亡！"), (e_gridCopy[r_eff][a_eff].content = "human-dead"), (e_gridCopy[r_eff][a_eff].isDecaying = !0), (changed_flag = !0))
                        : t.oxygenLevel > 30 && (messages_arr.push("氧气浓度高于30%，人类因含氧量超标死亡！"), (e_gridCopy[r_eff][a_eff].content = "human-dead"), (e_gridCopy[r_eff][a_eff].isDecaying = !0), (changed_flag = !0));
                    else if (("human-dead" === cell_in_effect.content || "tiger-dead" === cell_in_effect.content) && cell_in_effect.isDecaying) {
                      let decayingObjectName = "human-dead" === cell_in_effect.content ? "骸骨" : "老虎残骸"; // 修改：t -> decayingObjectName
                      (e_gridCopy[r_eff][a_eff].content = null), (e_gridCopy[r_eff][a_eff].isDecaying = !1), (changed_flag = !0), decayingMessageShown_flag || (messages_arr.push("一具".concat(decayingObjectName, "风化消失了。")), (decayingMessageShown_flag = !0));
                    }
                  });
                  messages_arr.length > 0 && messages_arr.forEach((msg) => f_addMessage(msg)); // 修改：e -> msg
                  changed_flag && g_updateGameState(e_gridCopy);
                }, [t.oxygenLevel, t.plantCount, t.grid, f_addMessage, g_updateGameState]),
                  (0, l.useEffect)(() => { // 处理火熄灭变灰烬
                    let e_gridCopy_fire = t.grid.map((row) => row.map((cell) => ({ ...cell }))), fireExtinguished_flag = !1, currentTime = Date.now(); // 修改：e,n,o -> descriptive names
                    e_gridCopy_fire.flat().forEach((cell_fire) => { "fire" === cell_fire.content && cell_fire.fireEndTime && currentTime >= cell_fire.fireEndTime && ((cell_fire.content = "ash"), (cell_fire.isFertile = !0), (cell_fire.fireEndTime = void 0), (fireExtinguished_flag = !0), f_addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。")); });
                    fireExtinguished_flag && g_updateGameState(e_gridCopy_fire);
                  }, [t.grid, f_addMessage, g_updateGameState]),
                  (0, l.useEffect)(() => { // 第三关倒计时和洪水
                    let interval_id; // 修改：e -> interval_id
                    if (3 === t.currentLevel && t.timeLeft > 0 && !t.isGameOver)
                      interval_id = setInterval(() => { n((gs_flood) => ({ ...gs_flood, timeLeft: gs_flood.timeLeft - 1 })); }, 1e3); // 修改：e -> gs_flood
                    else if (3 === t.currentLevel && 0 === t.timeLeft && !t.isGameOver) {
                      f_addMessage("120秒到！持续强降雨，引发大洪水！");
                      let newGrid_flood = t.grid.map((row_flood) => // 修改：e -> newGrid_flood, e -> row_flood
                        row_flood.map((cell_flood) => { // 修改：e -> cell_flood
                          let tempCell_flood = { ...cell_flood }; // 修改：t -> tempCell_flood, e -> cell_flood
                          return (
                            "fire" === tempCell_flood.content
                              ? ((tempCell_flood.content = "ash"), (tempCell_flood.isFertile = !0), (tempCell_flood.fireEndTime = void 0))
                              : "ash" !== tempCell_flood.content && ((tempCell_flood.content = null), (tempCell_flood.owner = null), "ash" !== cell_flood.content && (tempCell_flood.isFertile = !1)),
                            (tempCell_flood.isDecaying = !1),
                            tempCell_flood
                          );
                        })
                      );
                      n((gs_flood_update) => ({ // 修改：t -> gs_flood_update
                        ...gs_flood_update,
                        grid: newGrid_flood,
                        messages: [...gs_flood_update.messages.slice(-5), "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。"],
                        woodCount: 0,
                      }));
                      g_updateGameState(newGrid_flood);
                    }
                    return () => clearInterval(interval_id);
                  }, [t.currentLevel, t.timeLeft, t.isGameOver, f_addMessage, g_updateGameState, t.grid]);
                let x_saveHistory = () => { // 修改：x -> x_saveHistory
                    setHistory((prevHistory) => [...prevHistory, JSON.parse(JSON.stringify(t))]); // 修改：s -> setHistory, e -> prevHistory
                  },
                  m_handleCellClick = (row_idx, col_idx) => { // 修改：m -> m_handleCellClick, e,n -> row_idx, col_idx
                    x_saveHistory();
                    let gridCopy_click = t.grid.map((row) => row.map((cell) => ({ ...cell }))), // 修改：o -> gridCopy_click, e->row, e->cell
                      clickedCell = gridCopy_click[row_idx][col_idx], // 修改：l -> clickedCell
                      message_click = ""; // 修改：c -> message_click
                    if (r_selectedItem) { // 如果有选中的物品
                      if (null === clickedCell.content || ("ash" === clickedCell.content && "plant" === r_selectedItem)) {
                        if ("plant" === r_selectedItem)
                          clickedCell.isFertile || "ash" === clickedCell.content
                            ? ((clickedCell.content = "plant"), (clickedCell.isFertile = !0), (message_click = "放置了 植物"), setSelectedItem(null))
                            : (message_click = "土地贫瘠，植物无法生长！请先用火制造草木灰恢复地力。");
                        else if ("human" === r_selectedItem) {
                          if (((message_click = "放置了 人"), t.oxygenLevel < 20))
                            (message_click += "，但环境氧气浓度低于20%，人类窒息而亡！"), (clickedCell.content = "human-dead"), (clickedCell.isDecaying = !0);
                          else if (t.oxygenLevel > 30)
                            (message_click += "，但环境氧气浓度高于30%，人类因含氧量超标死亡！"), (clickedCell.content = "human-dead"), (clickedCell.isDecaying = !0);
                          else if (((clickedCell.content = "human"), i(row_idx, col_idx, gridCopy_click))) // 检查老虎
                            message_click += ", 附近有老虎威胁。";
                          else {
                            // **修改点：移除人类放置时消耗植物的逻辑**
                                // let existingPlants_human = gridCopy_click.flat().filter(cell => "plant" === cell.content);
                                // if (existingPlants_human.length > 0) {
                                //     let plantToDie_human = existingPlants_human[Math.floor(Math.random() * existingPlants_human.length)];
                                //     gridCopy_click[Math.floor(plantToDie_human.id / 4)][plantToDie_human.id % 4].content = "plant-dead",
                                //     message_click += ", 消耗了一株植物。";
                                // } else message_click += ", 但没有植物可消耗。";
                                message_click += "。"; // 确保提示信息连贯
                          }
                          setSelectedItem(null);
                        } else
                          "tiger" === r_selectedItem && ((clickedCell.content = "tiger"), (message_click = "放置了 老虎"), setSelectedItem(null));
                      } else
                        "human" === r_selectedItem && "house" === clickedCell.content && null === clickedCell.owner
                          ? ((clickedCell.owner = "human"), (message_click = "人住进了房子！"), setSelectedItem(null))
                          : (message_click = "这个格子已经被占用了或操作无效！");
                    } else if ("plant" === clickedCell.content)
                      i(row_idx, col_idx, gridCopy_click)
                        ? ((clickedCell.content = "fire"), (clickedCell.fireEndTime = Date.now() + 3e4), (message_click = h_handleFireEffect(gridCopy_click, (message_click = "植物在老虎的威胁下被点燃了！"))))
                        : t.currentLevel >= 2
                          ? ((clickedCell.content = "wood"), (message_click = "植物变成了木头！收集4块木头可以建造房子。"))
                          : (message_click = "点击植物。在第二关及以后，植物可以转化为木头。");
                    else if ("wood" === clickedCell.content && t.currentLevel >= 2) {
                      let woodId_click = clickedCell.id; // 修改：e -> woodId_click
                      if (!d_selectedWoods.includes(woodId_click)) {
                        let tempSelectedWoods = [...d_selectedWoods, woodId_click]; // 修改：t -> tempSelectedWoods
                        if ((setSelectedWoods(tempSelectedWoods), (message_click = "选择了木头 (".concat(tempSelectedWoods.length, "/4)。")), 4 === tempSelectedWoods.length)) {
                          let housePlaced_flag = !1; // 修改：e -> housePlaced_flag
                          for (let r_house = 0; r_house < 5; r_house++) { // 修改：n -> r_house
                            for (let c_house = 0; c_house < 4; c_house++) // 修改：l -> c_house
                              if (null === gridCopy_click[r_house][c_house].content || "ash" === gridCopy_click[r_house][c_house].content) {
                                (gridCopy_click[r_house][c_house].content = "house"),
                                (gridCopy_click[r_house][c_house].isFertile = !0),
                                (message_click = "4块木头合成了一座房子！"),
                                tempSelectedWoods.forEach((id_to_remove_wood) => { // 修改：e -> id_to_remove_wood
                                  gridCopy_click[Math.floor(id_to_remove_wood / 4)][id_to_remove_wood % 4].content = null;
                                });
                                housePlaced_flag = !0; break;
                              }
                            if (housePlaced_flag) break;
                          }
                          housePlaced_flag || (message_click = "没有空地建造房子！"), setSelectedWoods([]);
                        }
                      }
                    } else
                      "plant-dead" === clickedCell.content
                        ? ((clickedCell.content = "fire"), (clickedCell.fireEndTime = Date.now() + 3e4), (message_click = h_handleFireEffect(gridCopy_click, (message_click = "枯叶被点燃，变成了火！"))))
                        : (message_click = "请先选择一个物品，或点击植物/枯叶进行转化。");
                    message_click && f_addMessage(message_click);
                    let tigerEats_flag = !1, // 修改：s -> tigerEats_flag
                      gridAfterTiger_click = gridCopy_click.map((row) => row.map((cell) => ({ ...cell }))); // 修改：m -> gridAfterTiger_click, e->row, e->cell
                    if (t.currentLevel >= 2)
                      for (let r_tg_row = 0; r_tg_row < 5; r_tg_row++) { // 修改：e -> r_tg_row
                        for (let c_tg_col = 0; c_tg_col < 4; c_tg_col++) // 修改：t -> c_tg_col
                          if ("tiger" === gridAfterTiger_click[r_tg_row][c_tg_col].content) {
                            let humanEaten_flag = !1; // 修改：n -> humanEaten_flag
                            for (let [dr_tg, dc_tg] of [[-1, 0],[1, 0],[0, -1],[0, 1],[-1, -1],[-1, 1],[1, -1],[1, 1],]) { // 修改：o,l -> dr_tg,dc_tg
                              let h_row = r_tg_row + dr_tg, h_col = c_tg_col + dc_tg; // 修改：i,r -> h_row, h_col
                              if (h_row >= 0 && h_row < 5 && h_col >= 0 && h_col < 4) {
                                let targetCell_tg = gridAfterTiger_click[h_row][h_col]; // 修改：o -> targetCell_tg
                                if ("human" === targetCell_tg.content && !("human" === targetCell_tg.owner && "house" === gridAfterTiger_click[h_row][h_col].content)) {
                                  (gridAfterTiger_click[h_row][h_col].content = "human-dead"),
                                  (gridAfterTiger_click[h_row][h_col].isDecaying = !0),
                                  f_addMessage("老虎在(".concat(r_tg_row + 1, ",").concat(c_tg_col + 1, ")吃掉了(").concat(h_row + 1, ",").concat(h_col + 1, ")的人！")),
                                  (tigerEats_flag = !0), (humanEaten_flag = !0); break;
                                }
                              }
                            }
                            if (humanEaten_flag) break;
                          }
                        if (tigerEats_flag) break;
                      }
                    g_updateGameState(tigerEats_flag ? gridAfterTiger_click : gridCopy_click);
                  },
                  p_selectItem = (itemName) => { // 修改：p -> p_selectItem, e -> itemName
                    setSelectedItem(itemName), setSelectedWoods([]), f_addMessage("选择了 ".concat("plant" === itemName ? "植物" : "human" === itemName ? "人" : "老虎"));
                  },
                  y_getCellIcon = (cell) => // 修改：y -> y_getCellIcon, e -> cell
                    "plant" === cell.content ? "\uD83C\uDF3F"
                    : "plant-dead" === cell.content ? "\uD83C\uDF42"
                    : "human" === cell.content ? "\uD83E\uDDD1"
                    : "human-dead" === cell.content ? "\uD83D\uDC80"
                    : "tiger" === cell.content ? "\uD83D\uDC05"
                    : "tiger-dead" === cell.content ? "☠️"
                    : "fire" === cell.content ? "\uD83D\uDD25"
                    : "wood" === cell.content ? (d_selectedWoods.includes(cell.id) ? "\uD83E\uDEB5✨" : "\uD83E\uDEB5")
                    : "house" === cell.content ? ("human" === cell.owner ? "\uD83C\uDFE0\uD83E\uDDD1" : "\uD83C\uDFE0")
                    : "ash" === cell.content ? "\uD83E\uDEA8" : "",
                  b_getCellStyle = (cell_style) => { // 修改：b -> b_getCellStyle, e -> cell_style
                    let bgColor_cell = "#D2B48C"; // 修改：t -> bgColor_cell
                    return (
                      "fire" === cell_style.content ? (bgColor_cell = "#ffcc80")
                      : "ash" === cell_style.content ? (bgColor_cell = "#A9A9A9")
                      : cell_style.isFertile || (bgColor_cell = "#E0C9A6"),
                      {
                        border: "1px solid #a5d6a7", backgroundColor: bgColor_cell, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "2.5em",
                        cursor: "pointer", transition: "background-color 0.3s ease, transform 0.1s ease",
                        borderRadius: "4px", boxShadow: d_selectedWoods.includes(cell_style.id) ? "0 0 5px 2px yellow" : "none",
                      }
                    );
                  },
                  buttonStyle_v = { padding: "10px 15px", fontSize: "1em", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", margin: "5px" }, // 修改：v -> buttonStyle_v
                  textStyle_C = { margin: "5px 0", fontSize: "0.9em", color: "black" }, // 修改：C -> textStyle_C
                  headerStyle_w = { color: "black", marginTop: "15px", flexShrink: 0 }, // 修改：w -> headerStyle_w
                  timerStyle_L = { textAlign: "center", color: t.timeLeft < 10 ? "red" : t.timeLeft < 60 ? "#f57c00" : "black", marginTop: "0", marginBottom: "10px", flexShrink: 0 }; // 修改：L -> timerStyle_L
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
                          3 === t.currentLevel && (0, o.jsxs)("h3", { style: timerStyle_L, children: ["倒计时: ", t.timeLeft, "s"] }),
                          (0, o.jsx)("div", {
                            style: { display: "grid", gridTemplateColumns: "repeat(".concat(4, ", 80px)"), gridTemplateRows: "repeat(".concat(5, ", 80px)"), gap: "5px", border: "2px solid #a5d6a7", margin: "20px auto", backgroundColor: "#c8e6c9", borderRadius: "8px", padding: "5px" },
                            children: t.grid.flat().map((cell_data_map) => // 修改：e -> cell_data_map
                              (0, o.jsx)("div", {
                                onClick: () => m_handleCellClick(Math.floor(cell_data_map.id / 4), cell_data_map.id % 4),
                                style: b_getCellStyle(cell_data_map),
                                title: cell_data_map.content || (cell_data_map.isFertile ? ("ash" === cell_data_map.content ? "草木灰土地" : "空地") : "贫瘠土地"),
                                onMouseEnter: (e_hover) => (e_hover.currentTarget.style.transform = "scale(1.05)"), // 修改 e -> e_hover
                                onMouseLeave: (e_hover) => (e_hover.currentTarget.style.transform = "scale(1)"), // 修改 e -> e_hover
                                children: y_getCellIcon(cell_data_map),
                              }, cell_data_map.id)
                            ),
                          }),
                          (0, o.jsxs)("div", {
                            style: { textAlign: "center", marginTop: "20px", flexShrink: 0 },
                            children: [
                              (0, o.jsx)("button", { onClick: () => { c_history.length > 0 && (n(c_history[c_history.length - 1]), setHistory(c_history.slice(0, -1)), setSelectedWoods([]), f_addMessage("操作已撤销")); }, style: buttonStyle_v, children: "撤销" }),
                              (0, o.jsx)("button", {
                                onClick: () => {
                                  x_saveHistory(); let nextLevel = t.currentLevel < 3 ? t.currentLevel + 1 : 3; // 修改：o -> nextLevel
                                  f_addMessage(3 === t.currentLevel ? "重新开始关卡 ".concat(nextLevel) : "进入关卡 ".concat(nextLevel));
                                  n((gs_nextLevel) => ({ ...gs_nextLevel, currentLevel: nextLevel, grid: e(), oxygenLevel: 0, plantCount: 0, humanCount: 0, tigerCount: 0, woodCount: 0, timeLeft: 120, isGameOver: !1, messages: ["欢迎来到关卡 ".concat(nextLevel)] }));
                                  setSelectedWoods([]), g_updateGameState(e());
                                },
                                style: { ...buttonStyle_v, marginLeft: "10px" },
                                children: 3 === t.currentLevel ? "重新开始当前关卡" : "进入下一关",
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, o.jsxs)("div", {
                        style: { width: "300px", paddingLeft: "20px", borderLeft: "1px solid #bcaaa4", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0, padding: "10px" },
                        children: [
                          (0, o.jsx)("h3", { style: headerStyle_w, children: "可选生物/物品:" }),
                          (0, o.jsx)("div", {
                            style: { marginBottom: "15px", flexShrink: 0 },
                            children: [
                              { name: "plant", label: "植物 \uD83C\uDF3F" },
                              { name: "human", label: "人 \uD83E\uDDD1" },
                              { name: "tiger", label: "老虎 \uD83D\uDC05" },
                            ].map((item_data_map) => // 修改：e -> item_data_map
                              (0, o.jsx)("button", {
                                onClick: () => p_selectItem(item_data_map.name),
                                style: { padding: "10px", margin: "5px 0", width: "100%", fontSize: "1em", cursor: "pointer", backgroundColor: r_selectedItem === item_data_map.name ? "#a5d6a7" : "#fff", border: "1px solid #a5d6a7", borderRadius: "5px", color: "#333", textAlign: "left" },
                                children: item_data_map.label,
                              }, item_data_map.name)
                            ),
                          }),
                          (0, o.jsx)("h3", { style: headerStyle_w, children: "状态显示:" }),
                          (0, o.jsxs)("div", {
                            style: { marginBottom: "10px", flexShrink: 0 },
                            children: [
                              (0, o.jsxs)("p", { style: textStyle_C, children: ["氧气浓度: ", t.oxygenLevel, "%"] }),
                              (0, o.jsx)("div", {
                                style: { width: "100%", backgroundColor: "#ddd", borderRadius: "3px", height: "20px", overflow: "hidden" },
                                children: (0, o.jsx)("div", { style: { width: "".concat(t.oxygenLevel, "%"), backgroundColor: t.oxygenLevel < 20 || t.oxygenLevel > 30 ? "#f44336" : "#4caf50", height: "100%", borderRadius: "3px", transition: "width 0.5s ease-in-out" } }),
                              }),
                            ],
                          }),
                          (0, o.jsxs)("p", { style: textStyle_C, children: ["植物数量: ", t.plantCount, " \uD83C\uDF3F"] }),
                          (0, o.jsxs)("p", { style: textStyle_C, children: ["人类数量: ", t.humanCount, " \uD83E\uDDD1"] }),
                          (0, o.jsxs)("p", { style: textStyle_C, children: ["老虎数量: ", t.tigerCount, " \uD83D\uDC05"] }),
                          (0, o.jsxs)("p", { style: textStyle_C, children: ["木头数量: ", t.woodCount, " \uD83E\uDEB5"] }),
                          (0, o.jsx)("h3", { style: headerStyle_w, children: "信息提示:" }),
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