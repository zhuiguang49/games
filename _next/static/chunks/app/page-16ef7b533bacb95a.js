(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
        [974],
        {
          3662: (e, t, n) => {
            Promise.resolve().then(n.bind(n, 5288));
          },
          5288: (e, t, n) => {
            "use strict";
            n.d(t, { default: () => r_GameComponent });
            var o_jsx = n(2860),
              l_react = n(3200);
            let i_isTigerNearby = (e_row, t_col, n_grid) => {
                for (let [o_dr, l_dc] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                  let i_adjRow = e_row + o_dr, r_adjCol = t_col + l_dc;
                  if (i_adjRow >= 0 && i_adjRow < 5 && r_adjCol >= 0 && r_adjCol < 4 && "tiger" === n_grid[i_adjRow][r_adjCol].content)
                    return !0;
                }
                return !1;
              },
              r_GameComponent = () => {
                let e_initializeGrid = () =>
                    [, , , , ,].fill(null).map((e_map_row, t_map_row_idx) =>
                        [, , , ,].fill(null).map((e_map_col, n_map_col_idx) => ({
                            id: 4 * t_map_row_idx + n_map_col_idx,
                            content: null,
                            isFertile: !0,
                            owner: null,
                            isDecaying: !1,
                            decayEndTime: undefined,
                        }))
                      ),
                  [t_gameState, setGameState] = (0, l_react.useState)({
                    grid: e_initializeGrid(),
                    oxygenLevel: 0,
                    plantCount: 0,
                    humanCount: 0,
                    tigerCount: 0,
                    woodCount: 0,
                    currentLevel: 1,
                    timeLeft: 120,
                    messages: ["欢迎来到生态保护游戏！"],
                    isGameOver: !1,
                  isRaining: false,
                  plantsConsumedByHumanPairs: 0, // 新增：追踪因人类对而被消耗的植物数量
                  }),
                  [r_selectedItem, setSelectedItem] = (0, l_react.useState)(null),
                  [c_history, setHistory] = (0, l_react.useState)([]),
                  [d_selectedWoods, setSelectedWoods] = (0, l_react.useState)([]),
                  f_addMessage = (0, l_react.useCallback)((messageText_f) => {
                    setGameState((currentGameState_f) => ({ ...currentGameState_f, messages: [...currentGameState_f.messages.slice(-5), messageText_f] }));
                  }, []),
                  h_handleFireEffect = (0, l_react.useCallback)((currentGrid_h, messageLog_h) => {
                    let newMessageLog_h = messageLog_h;
                    if (currentGrid_h.flat().filter((cell_h) => "fire" === cell_h.content).length >= 2) {
                      for (let r_idx_h = 0; r_idx_h < 5; r_idx_h++)
                        for (let c_idx_h = 0; c_idx_h < 4; c_idx_h++)
                          if ("tiger" === currentGrid_h[r_idx_h][c_idx_h].content) {
                            let fireSources_h = 0;
                            for (let [dr_h, dc_h] of [[-1, 0],[1, 0],[0, -1],[0, 1],]) {
                              let adj_r_h = r_idx_h + dr_h, adj_c_h = c_idx_h + dc_h;
                              adj_r_h >= 0 && adj_r_h < 5 && adj_c_h >= 0 && adj_c_h < 4 && "fire" === currentGrid_h[adj_r_h][adj_c_h].content && fireSources_h++;
                            }
                            if (fireSources_h >= 2)
                              return ((currentGrid_h[r_idx_h][c_idx_h].content = "tiger-dead"),(currentGrid_h[r_idx_h][c_idx_h].isDecaying = !0), (currentGrid_h[r_idx_h][c_idx_h].decayEndTime = Date.now() + 1000), (newMessageLog_h += " 两团火的热量消灭了一只老虎！"));
                          }
                    }
                    return newMessageLog_h;
                  }, []),
                  g_updateGameState = (0, l_react.useCallback)((currentGrid_g_input) => {
                    let currentGrid_g = currentGrid_g_input.map(row => row.map(cell => ({...cell}))); // Work on a mutable copy
                    let plant_count_g = 0, human_count_g = 0, tiger_count_g = 0, wood_count_g = 0, oxygen_level_g = 0;
    
                    // 统计生物数量 (修改点：先统计，再处理因人类数量导致的植物消耗)
                    currentGrid_g.flat().forEach((cell_g) => {
                        if ("plant" === cell_g.content) plant_count_g++;
                        if (("human" === cell_g.content || "human" === cell_g.owner)) human_count_g++;
                        if ("tiger" === cell_g.content) tiger_count_g++;
                        if ("wood" === cell_g.content) wood_count_g++;
                    });
    
                    // **新增逻辑：根据人类数量消耗植物 (要求2)**
                    let plantsToConsumeTotal = Math.floor(human_count_g / 2);
                    let plantsActuallyConsumedThisUpdate = 0;
                    if (plantsToConsumeTotal > t_gameState.plantsConsumedByHumanPairs) {
                        let plantsToNewlyConsume = plantsToConsumeTotal - t_gameState.plantsConsumedByHumanPairs;
                        for (let r_idx = 0; r_idx < 5 && plantsToNewlyConsume > 0; r_idx++) {
                            for (let c_idx = 0; c_idx < 4 && plantsToNewlyConsume > 0; c_idx++) {
                                if (currentGrid_g[r_idx][c_idx].content === "plant") {
                                    currentGrid_g[r_idx][c_idx].content = null; // 植物直接消失
                                    plantsToNewlyConsume--;
                                    plantsActuallyConsumedThisUpdate++;
                                    plant_count_g--; // 更新实时植物数量
                                }
                            }
                        }
                        if (plantsActuallyConsumedThisUpdate > 0) {
                            f_addMessage(`因为人类数量达到${human_count_g}，${plantsActuallyConsumedThisUpdate}株植物消失了。`);
                        }
                    }
    
                    // 重新计算植物产氧，因为有些植物可能消失了
                    currentGrid_g.flat().forEach((cell_g) => {
                        if ("plant" === cell_g.content) {
                            oxygen_level_g += cell_g.isFertile ? 10 : 1;
                        }
                    });
    
                    oxygen_level_g -= 5 * human_count_g; // 人类固定消耗5%氧气
                    oxygen_level_g = Math.max(0, Math.min(100, oxygen_level_g));
    
                    setGameState((current_gs_update) => ({
                      ...current_gs_update,
                      plantCount: plant_count_g, // 使用更新后的植物数量
                      humanCount: human_count_g,
                      tigerCount: tiger_count_g,
                      woodCount: wood_count_g,
                      oxygenLevel: oxygen_level_g,
                      grid: currentGrid_g,
                    plantsConsumedByHumanPairs: plantsToConsumeTotal, // 更新已消耗的植物对数
                    }));
                  }, [f_addMessage, t_gameState.plantsConsumedByHumanPairs]), // 添加依赖
                (0, l_react.useEffect)(() => { // 处理人类因氧气死亡及生物风化
                  let e_gridCopy_death = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))),
                    messages_arr_death = [], changed_flag_death = !1, decayingMessageShown_this_run = !1, currentTime_decay_eff = Date.now();
    
                  e_gridCopy_death.flat().forEach((cell_in_death_effect) => {
                    let r_death_eff = Math.floor(cell_in_death_effect.id / 4), a_death_eff = cell_in_death_effect.id % 4;
                    // 人类死亡判断 (要求3, 4)
                    if (("human" === cell_in_death_effect.content && cell_in_death_effect.owner !== "human") || ("house" === cell_in_death_effect.content && "human" === cell_in_death_effect.owner)) {
                        const oxygenLow = t_gameState.oxygenLevel < 20;
                        const oxygenHigh = t_gameState.oxygenLevel > 30;
                        if (oxygenLow || oxygenHigh) {
                            const message = oxygenLow ? "氧气浓度低于20%，人类窒息而亡！" : "氧气浓度高于30%，人类因含氧量超标死亡！";
                            messages_arr_death.push(message);
                            if ("human" === e_gridCopy_death[r_death_eff][a_death_eff].owner) { // 人在房子里
                                e_gridCopy_death[r_death_eff][a_death_eff].owner = null;
                            } else { // 人在格子里
                                e_gridCopy_death[r_death_eff][a_death_eff].content = "human-dead";
                                e_gridCopy_death[r_death_eff][a_death_eff].isDecaying = !0;
                                e_gridCopy_death[r_death_eff][a_death_eff].decayEndTime = currentTime_decay_eff + 1000;
                            }
                            changed_flag_death = !0;
                        }
                    }
                    // 生物残骸风化 (要求6)
                    else if (("human-dead" === cell_in_death_effect.content || "tiger-dead" === cell_in_death_effect.content) && cell_in_death_effect.isDecaying && currentTime_decay_eff >= cell_in_death_effect.decayEndTime) {
                      let decayingObjectName_death = "human-dead" === cell_in_death_effect.content ? "骸骨" : "老虎残骸";
                      (e_gridCopy_death[r_death_eff][a_death_eff].content = null);
                      (e_gridCopy_death[r_death_eff][a_death_eff].isDecaying = !1);
                      (e_gridCopy_death[r_death_eff][a_death_eff].decayEndTime = undefined);
                      (changed_flag_death = !0);
                      if (!decayingMessageShown_this_run) { // 避免同一轮次显示多次风化
                         messages_arr_death.push("一具".concat(decayingObjectName_death, "风化消失了。"));
                         decayingMessageShown_this_run = true;
                      }
                    }
                  });
                  messages_arr_death.length > 0 && messages_arr_death.forEach((msg) => f_addMessage(msg));
                  if (changed_flag_death) {
                    g_updateGameState(e_gridCopy_death);
                  }
                  // 定时器确保即使没有其他状态更新，也会检查decay (要求6)
                  const decayCheckIntervalId = setInterval(() => {
                    let decayGridCopy_interval = t_gameState.grid.map(row => row.map(cell => ({...cell})));
                    let decayOccurred_interval = false;
                    let currentDecayTime_interval = Date.now();
                    let decayMessages_interval = [];
                    let decayingMessageShown_interval_run = false;
    
                    decayGridCopy_interval.flat().forEach(cell_interval => {
                        if (("human-dead" === cell_interval.content || "tiger-dead" === cell_interval.content) && cell_interval.isDecaying && currentDecayTime_interval >= cell_interval.decayEndTime) {
                            const r_eff_decay_interval = Math.floor(cell_interval.id / 4);
                            const a_eff_decay_interval = cell_interval.id % 4;
                            let decayingObjectName_interval_eff = "human-dead" === cell_interval.content ? "骸骨" : "老虎残骸";
                            decayGridCopy_interval[r_eff_decay_interval][a_eff_decay_interval].content = null;
                            decayGridCopy_interval[r_eff_decay_interval][a_eff_decay_interval].isDecaying = !1;
                            decayGridCopy_interval[r_eff_decay_interval][a_eff_decay_interval].decayEndTime = undefined;
                            decayOccurred_interval = true;
                            if (!decayingMessageShown_interval_run) {
                                 decayMessages_interval.push("一具".concat(decayingObjectName_interval_eff, "风化消失了。"));
                                 decayingMessageShown_interval_run = true; // 只在本次 interval run 中显示一次
                            }
                        }
                    });
                    if (decayOccurred_interval) {
                        decayMessages_interval.forEach(msg => f_addMessage(msg));
                        g_updateGameState(decayGridCopy_interval);
                    }
                  }, 500); // 每500ms检查一次
    
                  return () => clearInterval(decayCheckIntervalId);
                }, [t_gameState.oxygenLevel, t_gameState.grid, f_addMessage, g_updateGameState]),
                  (0, l_react.useEffect)(() => { // 处理火熄灭变灰烬
                    let e_gridCopy_fire_ext_eff = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))), fireExtinguished_flag_ext_eff = !1, currentTime_ext_eff = Date.now();
                    e_gridCopy_fire_ext_eff.flat().forEach((cell_fire_ext_eff) => { "fire" === cell_fire_ext_eff.content && cell_fire_ext_eff.fireEndTime && currentTime_ext_eff >= cell_fire_ext_eff.fireEndTime && ((cell_fire_ext_eff.content = "ash"), (cell_fire_ext_eff.isFertile = !0), (cell_fire_ext_eff.fireEndTime = void 0), (fireExtinguished_flag_ext_eff = !0), f_addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。")); });
                    fireExtinguished_flag_ext_eff && g_updateGameState(e_gridCopy_fire_ext_eff);
                  }, [t_gameState.grid, f_addMessage, g_updateGameState]),
                  (0, l_react.useEffect)(() => { // 第三关倒计时和洪水 (要求7)
                    let interval_id_flood_eff;
                    if (3 === t_gameState.currentLevel && t_gameState.timeLeft > 0 && !t_gameState.isGameOver)
                      interval_id_flood_eff = setInterval(() => { setGameState((gs_flood_timer_eff) => ({ ...gs_flood_timer_eff, timeLeft: gs_flood_timer_eff.timeLeft - 1 })); }, 1e3);
                    else if (3 === t_gameState.currentLevel && 0 === t_gameState.timeLeft && !t_gameState.isGameOver) {
                      setGameState(gs_flood_start => ({...gs_flood_start, isRaining: true}));
                      f_addMessage("120秒到！持续强降雨，引发洪水！");
                      setTimeout(() => {
                          let newGrid_after_flood_eff = t_gameState.grid.map((row_after_flood_eff) =>
                              row_after_flood_eff.map((cell_after_flood_eff) => {
                                  let tempCell_after_flood_eff = { ...cell_after_flood_eff };
                                  if ("fire" === tempCell_after_flood_eff.content) {
                                      tempCell_after_flood_eff.content = "ash";
                                      tempCell_after_flood_eff.isFertile = !0;
                                      tempCell_after_flood_eff.fireEndTime = void 0;
                                  } else if ("ash" !== tempCell_after_flood_eff.content) {
                                      tempCell_after_flood_eff.content = null;
                                      tempCell_after_flood_eff.owner = null;
                                      if ("ash" !== cell_after_flood_eff.content) {
                                        tempCell_after_flood_eff.isFertile = !1;
                                      }
                                  }
                                  tempCell_after_flood_eff.isDecaying = !1;
                                  tempCell_after_flood_eff.decayEndTime = undefined;
                                  return tempCell_after_flood_eff;
                              })
                          );
                          setGameState((gs_flood_update_timeout_eff) => ({
                              ...gs_flood_update_timeout_eff,
                              grid: newGrid_after_flood_eff,
                              messages: [...gs_flood_update_timeout_eff.messages.slice(-5), "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。"],
                              woodCount: 0,
                              isRaining: false,
                              plantsConsumedByHumanPairs: 0, // 洪水后重置计数器
                          }));
                          g_updateGameState(newGrid_after_flood_eff);
                      }, 3000);
                    }
                    return () => clearInterval(interval_id_flood_eff);
                  }, [t_gameState.currentLevel, t_gameState.timeLeft, t_gameState.isGameOver, f_addMessage, g_updateGameState, t_gameState.grid]),
                  x_saveHistory = () => {
                    setHistory((prevHistory_x_save) => [...prevHistory_x_save, JSON.parse(JSON.stringify(t_gameState))]);
                  },
                  m_handleCellClick = (row_idx_click_m, col_idx_click_m) => {
                    x_saveHistory();
                    let gridCopy_on_click_m = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))),
                      clickedCell_on_click_m = gridCopy_on_click_m[row_idx_click_m][col_idx_click_m],
                      message_on_click_m = "";
                    if (r_selectedItem) {
                      if (null === clickedCell_on_click_m.content || ("ash" === clickedCell_on_click_m.content && "plant" === r_selectedItem)) {
                        if ("plant" === r_selectedItem) { // 要求8：允许在灰烬或肥沃土地上种植
                                // 在第三关洪水后，允许在任何土地种植，产氧量由isFertile决定
                                const canPlant = clickedCell_on_click_m.isFertile || 
                                                "ash" === clickedCell_on_click_m.content ||
                                                (t_gameState.currentLevel === 3 && t_gameState.timeLeft === 0 && t_gameState.grid.every(r => r.every(c => c.content !== "fire"))); // 确保是洪水后
                          
                            if (canPlant) {
                                    clickedCell_on_click_m.content = "plant";
                                    // isFertile 状态在放置时不改变，除非是灰烬地 -> 变肥沃
                                    if ("ash" === clickedCell_on_click_m.content || clickedCell_on_click_m.isFertile) { // 之前的ash或者本来就肥沃
                                        clickedCell_on_click_m.isFertile = !0;
                                    }
                                    // 如果是在洪水后种植在原贫瘠土地上，isFertile 保持 false，产氧1%
                                    message_on_click_m = "放置了 植物";
                                    setSelectedItem(null);
                                } else {
                                    message_on_click_m = "土地贫瘠，植物无法生长！请先用火制造草木灰恢复地力。";
                                }
                            }
                        else if ("human" === r_selectedItem) {
                            // 要求5：老虎存在时不能放置人类（会被立刻吃掉）
                            if (t_gameState.tigerCount > 0 && !(clickedCell_on_click_m.content === 'house' && clickedCell_on_click_m.owner === null) ) {
                                message_on_click_m = "刚放置的人类被老虎吃掉了！";
                                clickedCell_on_click_m.content = "human-dead"; // 放置后立刻死亡
                                clickedCell_on_click_m.isDecaying = true;
                                clickedCell_on_click_m.decayEndTime = Date.now() + 1000;
                            } else {
                              	message_on_click_m = "放置了 人";
                              	if (t_gameState.oxygenLevel < 20) {
                                	message_on_click_m += "，但环境氧气浓度低于20%，人类窒息而亡！";
                                	clickedCell_on_click_m.content = "human-dead";
                                	clickedCell_on_click_m.isDecaying = !0;
                                    clickedCell_on_click_m.decayEndTime = Date.now() + 1000;
                                } else if (t_gameState.oxygenLevel > 30) {
                                	message_on_click_m += "，但环境氧气浓度高于30%，人类因含氧量超标死亡！";
                                	clickedCell_on_click_m.content = "human-dead";
                                	clickedCell_on_click_m.isDecaying = !0;
                                    clickedCell_on_click_m.decayEndTime = Date.now() + 1000;
                              } else {
                                    clickedCell_on_click_m.content = "human";
                                    // 人类放置不直接消耗植物，此逻辑已移至 g_updateGameState
                                    // message_on_click_m += "。"; // 之前的提示，如果需要可以保留
                                }
                            }
                          setSelectedItem(null);
                        } else
                          "tiger" === r_selectedItem && ((clickedCell_on_click_m.content = "tiger"), (message_on_click_m = "放置了 老虎"), setSelectedItem(null));
                      } else
                        "human" === r_selectedItem && "house" === clickedCell_on_click_m.content && null === clickedCell_on_click_m.owner
                          ? ((clickedCell_on_click_m.owner = "human"), (message_on_click_m = "人住进了房子！"), setSelectedItem(null))
                          : (message_on_click_m = "这个格子已经被占用了或操作无效！");
                    } else if ("plant" === clickedCell_on_click_m.content) {
                      if (i_isTigerNearby(row_idx_click_m, col_idx_click_m, gridCopy_on_click_m)) {
                        ((clickedCell_on_click_m.content = "fire"), (clickedCell_on_click_m.fireEndTime = Date.now() + 30000), (message_on_click_m = h_handleFireEffect(gridCopy_on_click_m, (message_on_click_m = "植物在老虎的威胁下被点燃了！"))));
                      } else if (t_gameState.currentLevel >= 3 ) { // 要求8/10: 第三关或之后，点植物可以烧制草木灰改良土壤
                          clickedCell_on_click_m.content = "fire";
                          clickedCell_on_click_m.fireEndTime = Date.now() + 30000;
                          message_on_click_m = "植物被点燃了。火焰熄灭后将形成草木灰并增加土壤肥力。";
                      } else if (t_gameState.currentLevel >= 2) {
                          ((clickedCell_on_click_m.content = "wood"), (message_on_click_m = "植物变成了木头！收集4块木头可以建造房子。"));
                      } else {
                          (message_on_click_m = "点击植物。在第二关及以后，植物可以转化为木头。");
                      }
                    } else if ("wood" === clickedCell_on_click_m.content && t_gameState.currentLevel >= 2) {
                      let woodId_click_m_wood = clickedCell_on_click_m.id;
                      if (!d_selectedWoods.includes(woodId_click_m_wood)) {
                        let tempSelectedWoods_m_wood = [...d_selectedWoods, woodId_click_m_wood];
                        if ((setSelectedWoods(tempSelectedWoods_m_wood), (message_on_click_m = "选择了木头 (".concat(tempSelectedWoods_m_wood.length, "/4)。")), 4 === tempSelectedWoods_m_wood.length)) {
                          let housePlaced_flag_m_wood = !1;
                          for (let r_house_m_wood = 0; r_house_m_wood < 5; r_house_m_wood++) {
                            for (let c_house_m_wood = 0; c_house_m_wood < 4; c_house_m_wood++)
                              if (null === gridCopy_on_click_m[r_house_m_wood][c_house_m_wood].content || "ash" === gridCopy_on_click_m[r_house_m_wood][c_house_m_wood].content) {
                                (gridCopy_on_click_m[r_house_m_wood][c_house_m_wood].content = "house"),
                                (gridCopy_on_click_m[r_house_m_wood][c_house_m_wood].isFertile = !0),
                                (message_on_click_m = "4块木头合成了一座房子！"),
                                tempSelectedWoods_m_wood.forEach((id_to_remove_wood_item_m) => {
                                  gridCopy_on_click_m[Math.floor(id_to_remove_wood_item_m / 4)][id_to_remove_wood_item_m % 4].content = null;
                                });
                                housePlaced_flag_m_wood = !0; break;
                              }
                            if (housePlaced_flag_m_wood) break;
                          }
                          housePlaced_flag_m_wood || (message_on_click_m = "没有空地建造房子！"), setSelectedWoods([]);
                        }
                      }
                    } else
                      "plant-dead" === clickedCell_on_click_m.content
                        ? ((clickedCell_on_click_m.content = "fire"), (clickedCell_on_click_m.fireEndTime = Date.now() + 30000), (message_on_click_m = h_handleFireEffect(gridCopy_on_click_m, (message_on_click_m = "枯叶被点燃，变成了火！"))))
                        : (message_on_click_m = "请先选择一个物品，或点击植物/枯叶进行转化。");
    
                    // **新增：老虎全局吃人逻辑 (要求5)**
                    if (t_gameState.tigerCount > 0 || (r_selectedItem === "tiger" && clickedCell_on_click_m.content === "tiger")) { // 放置了老虎或者场上已有老虎
                        for (let r_tg_eat = 0; r_tg_eat < 5; r_tg_eat++) {
                            for (let c_tg_eat = 0; c_tg_eat < 4; c_tg_eat++) {
                                if (gridCopy_on_click_m[r_tg_eat][c_tg_eat].content === "human" && gridCopy_on_click_m[r_tg_eat][c_tg_eat].owner !== "human") {
                                    gridCopy_on_click_m[r_tg_eat][c_tg_eat].content = "human-dead";
                                    gridCopy_on_click_m[r_tg_eat][c_tg_eat].isDecaying = true;
                                    gridCopy_on_click_m[r_tg_eat][c_tg_eat].decayEndTime = Date.now() + 1000;
                                    f_addMessage("一只老虎吃掉了位于(".concat(r_tg_eat + 1, ",").concat(c_tg_eat + 1, ")的人！"));
                                    // 如果需要一次只吃一个，可以在这里加 break 或者更复杂的逻辑
                                }
                            }
                        }
                    }
    
                    message_on_click_m && f_addMessage(message_on_click_m);
                    g_updateGameState(gridCopy_on_click_m);
                  },
                  p_selectItem = (itemName_select_p) => {
                    setSelectedItem(itemName_select_p);
                    setSelectedWoods([]); // 清空已选木材
                    f_addMessage("选择了 ".concat("plant" === itemName_select_p ? "植物" : "human" === itemName_select_p ? "人" : "老虎"));
                  },
                  y_getCellIcon = (cell_icon_y) =>
                    "plant" === cell_icon_y.content ? "\uD83C\uDF3F"
                    : "plant-dead" === cell_icon_y.content ? "\uD83C\uDF42"
                    : "human" === cell_icon_y.content ? "\uD83E\uDDD1"
                    : "human-dead" === cell_icon_y.content ? "\uD83D\uDC80"
                    : "tiger" === cell_icon_y.content ? "\uD83D\uDC05"
                    : "tiger-dead" === cell_icon_y.content ? "☠️"
                    : "fire" === cell_icon_y.content ? "\uD83D\uDD25"
                    : "wood" === cell_icon_y.content ? (d_selectedWoods.includes(cell_icon_y.id) ? "\uD83E\uDEB5✨" : "\uD83E\uDEB5")
                    : "house" === cell_icon_y.content ? ("human" === cell_icon_y.owner ? "\uD83C\uDFE0\uD83E\uDDD1" : "\uD83C\uDFE0")
                    : "ash" === cell_icon_y.content ? "\uD83E\uDEA8" : "",
                  b_getCellStyle = (cell_style_b_style) => {
                    let bgColor_cell_b_style = "#D2B48C";
                    return (
                      "fire" === cell_style_b_style.content ? (bgColor_cell_b_style = "#ffcc80")
                      : "ash" === cell_style_b_style.content ? (bgColor_cell_b_style = "#A9A9A9")
                      : cell_style_b_style.isFertile || (bgColor_cell_b_style = "#E0C9A6"),
                      {
                        border: "1px solid #a5d6a7", backgroundColor: bgColor_cell_b_style, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "2.5em",
                        cursor: "pointer", transition: "background-color 0.3s ease, transform 0.1s ease",
                        borderRadius: "4px", boxShadow: d_selectedWoods.includes(cell_style_b_style.id) ? "0 0 5px 2px yellow" : "none",
                      }
                    );
                  },
                  buttonStyle_render = { padding: "10px 15px", fontSize: "1em", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", margin: "5px" },
                  textStyle_render = { margin: "5px 0", fontSize: "0.9em", color: "black" },
                  headerStyle_render = { color: "black", marginTop: "15px", flexShrink: 0 },
                  timerStyle_render = { textAlign: "center", color: t_gameState.timeLeft < 10 ? "red" : t_gameState.timeLeft < 60 ? "#f57c00" : "black", marginTop: "0", marginBottom: "10px", flexShrink: 0 };
    
                    // 可选生物列表 (要求1)
                    const selectableItems = [
                        { name: "plant", label: "植物 \uD83C\uDF3F" },
                        { name: "human", label: "人 \uD83E\uDDD1" },
                    ];
                    if (t_gameState.currentLevel > 1) {
                        selectableItems.push({ name: "tiger", label: "老虎 \uD83D\uDC05" });
                    }
    
                return (0, o_jsx.jsx)("div", {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", width: "100vw", padding: "0px", margin: "0px", boxSizing: "border-box", backgroundColor: "#001f3f" },
                  children: (0, o_jsx.jsxs)("div", {
                    style: { position:"relative", display: "flex", flexDirection: "row", backgroundColor: "#e0f2f1", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "100%", height: "100%", maxWidth: "1200px", maxHeight: "95vh", boxSizing: "border-box", overflow: "hidden" },
                    children: [
                      t_gameState.isRaining && (0, o_jsx.jsx)("div", { // 要求7：下雨视觉效果
                        style: {
                            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                            backgroundColor: "rgba(100,100,150,0.3)", // 模拟乌云
                            zIndex: 1000,
                            pointerEvents: "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            overflow: "hidden"
                        },
                        // 简单的雨滴效果，可以用CSS动画做得更好
                        children: Array.from({ length: 50 }).map((_, idx) => (0, o_jsx.jsx)("div", {
                            style: {
                                position: "absolute",
                                left: "".concat(Math.random() * 100, "%"),
                                width: "2px",
                                height: "".concat(10 + Math.random() * 10, "px"),
                                backgroundColor: "rgba(173, 216, 230, 0.7)", // Light blue raindrops
                                animation: "fall ".concat(0.5 + Math.random() * 0.5, "s linear infinite"),
                                animationDelay: "".concat(Math.random() * 3, "s") // Stagger start times
                            }
                        }, "rain-".concat(idx)))
                      }),
                      (0, o_jsx.jsx)("style", { // CSS for rain animation
                        children: `
                            @keyframes fall {
                                to {
                                    transform: translateY(100vh);
                                    opacity: 0;
                                }
                            }
                        `
                      }),
                      (0, o_jsx.jsxs)("div", {
                        style: { flexGrow: 1, marginRight: "20px", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "10px" },
                        children: [
                          (0, o_jsx.jsx)("h1", { style: { textAlign: "center", fontSize: "1.5em", color: "#2e7d32", marginBottom: "5px", flexShrink: 0 }, children: "创设氧气浓度适宜生物多样化的环境" }),
                          (0, o_jsx.jsxs)("h2", { style: { textAlign: "center", fontSize: "1.2em", color: "#4caf50", marginTop: "0", marginBottom: "10px", flexShrink: 0 }, children: ["当前关卡：", t_gameState.currentLevel] }),
                          3 === t_gameState.currentLevel && !t_gameState.isGameOver && (0, o_jsx.jsxs)("h3", { style: timerStyle_render, children: ["倒计时: ", t_gameState.timeLeft, "s"] }),
                          (0, o_jsx.jsx)("div", {
                            style: { display: "grid", gridTemplateColumns: "repeat(".concat(4, ", 80px)"), gridTemplateRows: "repeat(".concat(5, ", 80px)"), gap: "5px", border: "2px solid #a5d6a7", margin: "20px auto", backgroundColor: "#c8e6c9", borderRadius: "8px", padding: "5px" },
                            children: t_gameState.grid.flat().map((cell_data_final_map_render) =>
                              (0, o_jsx.jsx)("div", {
                                onClick: () => m_handleCellClick(Math.floor(cell_data_final_map_render.id / 4), cell_data_final_map_render.id % 4),
                                style: b_getCellStyle(cell_data_final_map_render),
                                title: cell_data_final_map_render.content || (cell_data_final_map_render.isFertile ? ("ash" === cell_data_final_map_render.content ? "草木灰土地" : "空地") : "贫瘠土地"),
                                onMouseEnter: (e_hover_final_render) => (e_hover_final_render.currentTarget.style.transform = "scale(1.05)"),
                                onMouseLeave: (e_hover_final_render) => (e_hover_final_render.currentTarget.style.transform = "scale(1)"),
                                children: y_getCellIcon(cell_data_final_map_render),
                              }, cell_data_final_map_render.id)
                            ),
                          }),
                          (0, o_jsx.jsxs)("div", {
                            style: { textAlign: "center", marginTop: "20px", flexShrink: 0 },
                            children: [
                              (0, o_jsx.jsx)("button", { onClick: () => { c_history.length > 0 && (setGameState(c_history[c_history.length - 1]), setHistory(c_history.slice(0, -1)), setSelectedWoods([]), f_addMessage("操作已撤销")); }, style: buttonStyle_render, children: "撤销" }),
                              (0, o_jsx.jsx)("button", {
                                onClick: () => {
                                  x_saveHistory(); let nextLevel_final_render = t_gameState.currentLevel < 3 ? t_gameState.currentLevel + 1 : 3;
                                  f_addMessage(3 === t_gameState.currentLevel && t_gameState.timeLeft > 0 ? "重新开始当前关卡" : (3 === t_gameState.currentLevel ? "游戏结束，重新开始第三关" : "进入关卡 ".concat(nextLevel_final_render)));
                                  setGameState((gs_nextLevel_final_render) => ({ ...gs_nextLevel_final_render, currentLevel: nextLevel_final_render, grid: e_initializeGrid(), oxygenLevel: 0, plantCount: 0, humanCount: 0, tigerCount: 0, woodCount: 0, timeLeft: 120, isGameOver: false, messages: ["欢迎来到关卡 ".concat(nextLevel_final_render)], plantsConsumedByHumanPairs: 0 }));
                                  setSelectedWoods([]), g_updateGameState(e_initializeGrid());
                                },
                                style: { ...buttonStyle_render, marginLeft: "10px" },
                                children: 3 === t_gameState.currentLevel && t_gameState.timeLeft > 0 ? "重新开始当前关卡" : (3 === t_gameState.currentLevel ? "重新开始第三关" : "进入下一关"),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, o_jsx.jsxs)("div", {
                        style: { width: "300px", paddingLeft: "20px", borderLeft: "1px solid #bcaaa4", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0, padding: "10px" },
                        children: [
                          (0, o_jsx.jsx)("h3", { style: headerStyle_render, children: "可选生物/物品:" }),
                          (0, o_jsx.jsx)("div", {
                            style: { marginBottom: "15px", flexShrink: 0 },
                            children: selectableItems.map((item_data_final_map_render) => // 使用过滤后的列表
                              (0, o_jsx.jsx)("button", {
                                onClick: () => p_selectItem(item_data_final_map_render.name),
                                style: { padding: "10px", margin: "5px 0", width: "100%", fontSize: "1em", cursor: "pointer", backgroundColor: r_selectedItem === item_data_final_map_render.name ? "#a5d6a7" : "#fff", border: "1px solid #a5d6a7", borderRadius: "5px", color: "#333", textAlign: "left" },
                                children: item_data_final_map_render.label,
                              }, item_data_final_map_render.name)
                            ),
                          }),
                          (0, o_jsx.jsx)("h3", { style: headerStyle_render, children: "状态显示:" }),
                          (0, o_jsx.jsxs)("div", {
                            style: { marginBottom: "10px", flexShrink: 0 },
                            children: [
                              (0, o_jsx.jsxs)("p", { style: textStyle_render, children: ["氧气浓度: ", t_gameState.oxygenLevel, "%"] }),
                              (0, o_jsx.jsx)("div", {
                                style: { width: "100%", backgroundColor: "#ddd", borderRadius: "3px", height: "20px", overflow: "hidden" },
                                children: (0, o_jsx.jsx)("div", { style: { width: "".concat(t_gameState.oxygenLevel, "%"), backgroundColor: t_gameState.oxygenLevel < 20 || t_gameState.oxygenLevel > 30 ? "#f44336" : "#4caf50", height: "100%", borderRadius: "3px", transition: "width 0.5s ease-in-out" } }),
                              }),
                            ],
                          }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render, children: ["植物数量: ", t_gameState.plantCount, " \uD83C\uDF3F"] }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render, children: ["人类数量: ", t_gameState.humanCount, " \uD83E\uDDD1"] }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render, children: ["老虎数量: ", t_gameState.tigerCount, " \uD83D\uDC05"] }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render, children: ["木头数量: ", t_gameState.woodCount, " \uD83E\uDEB5"] }),
                          (0, o_jsx.jsx)("h3", { style: headerStyle_render, children: "信息提示:" }),
                          (0, o_jsx.jsx)("textarea", { readOnly: !0, value: t_gameState.messages.join("\n"), style: { width: "100%", minHeight: "100px", flexGrow: 1, border: "1px solid #a5d6a7", borderRadius: "5px", padding: "10px", fontSize: "0.9em", backgroundColor: "#f1f8e9", boxSizing: "border-box", resize: "none", color: "black" } }),
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