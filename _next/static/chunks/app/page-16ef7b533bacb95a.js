(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
        [974],
        {
          3662: (e, t, n) => {
            Promise.resolve().then(n.bind(n, 5288));
          },
          5288: (e, t, n) => {
            "use strict";
            n.d(t, { default: () => r_GameComponent }); // Renamed r to r_GameComponent
            var o_jsx = n(2860), // Renamed o to o_jsx
              l_react = n(3200); // Renamed l to l_react
    
            let i_isTigerNearby = (e_row, t_col, n_grid) => {
                for (let [o_dr, l_dc] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                  let i_adjRow = e_row + o_dr, r_adjCol = t_col + l_dc;
                  if (i_adjRow >= 0 && i_adjRow < 5 && r_adjCol >= 0 && r_adjCol < 4 && "tiger" === n_grid[i_adjRow][r_adjCol].content)
                    return !0;
                }
                return !1;
              };
    
              const r_GameComponent = () => {
                const e_initializeGrid = () =>
                    [, , , , ,].fill(null).map((e_map_row, t_map_row_idx) =>
                        [, , , ,].fill(null).map((e_map_col, n_map_col_idx) => ({
                            id: 4 * t_map_row_idx + n_map_col_idx,
                            content: null,
                            isFertile: !0,
                            owner: null,
                            isDecaying: !1,
                            decayEndTime: undefined,
                        }))
                      );
    
                  const [t_gameState, setGameState] = (0, l_react.useState)({
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
                  plantsConsumedByHumanPairs: 0,
                  });
    
                  const [r_selectedItem, setSelectedItem] = (0, l_react.useState)(null);
                  const [c_history, setHistory] = (0, l_react.useState)([]);
                  const [d_selectedWoods, setSelectedWoods] = (0, l_react.useState)([]);
    
                  const f_addMessage = (0, l_react.useCallback)((messageText_f) => {
                    setGameState((currentGameState_f) => ({ ...currentGameState_f, messages: [...currentGameState_f.messages.slice(-5), messageText_f] }));
                  }, []);
    
                  const h_handleFireEffect = (0, l_react.useCallback)((currentGrid_h, messageLog_h) => {
                    let newMessageLog_h = messageLog_h;
                    if (currentGrid_h.flat().filter((cell_h) => "fire" === cell_h.content).length >= 2) {
                      for (let r_idx_h = 0; r_idx_h < 5; r_idx_h++) {
                        for (let c_idx_h = 0; c_idx_h < 4; c_idx_h++) {
                          if ("tiger" === currentGrid_h[r_idx_h][c_idx_h].content) {
                            let fireSources_h = 0;
                            for (let [dr_h, dc_h] of [[-1, 0],[1, 0],[0, -1],[0, 1]]) {
                              let adj_r_h = r_idx_h + dr_h, adj_c_h = c_idx_h + dc_h;
                              if (adj_r_h >= 0 && adj_r_h < 5 && adj_c_h >= 0 && adj_c_h < 4 && "fire" === currentGrid_h[adj_r_h][adj_c_h].content) {
                                    fireSources_h++;
                                }
                            }
                            if (fireSources_h >= 2) {
                              currentGrid_h[r_idx_h][c_idx_h].content = "tiger-dead";
                              currentGrid_h[r_idx_h][c_idx_h].isDecaying = !0;
                                currentGrid_h[r_idx_h][c_idx_h].decayEndTime = Date.now() + 1000;
                              newMessageLog_h += " 两团火的热量消灭了一只老虎！";
                                return newMessageLog_h; // Tiger消灭后直接返回，避免重复处理
                            }
                          }
                        }
                      }
                    }
                    return newMessageLog_h;
                  }, []);
    
                  const g_updateGameState = (0, l_react.useCallback)((currentGrid_g_input) => {
                    let workingGrid_g = currentGrid_g_input.map(row => row.map(cell => ({...cell})));
                    let plant_count_g = 0, human_count_g = 0, tiger_count_g = 0, wood_count_g = 0, oxygen_level_g = 0;
    
                    workingGrid_g.flat().forEach((cell_g) => {
                        if ("plant" === cell_g.content) plant_count_g++;
                        if (("human" === cell_g.content || "human" === cell_g.owner)) human_count_g++;
                        if ("tiger" === cell_g.content) tiger_count_g++;
                        if ("wood" === cell_g.content) wood_count_g++;
                    });
    
                    // **要求2：根据人类数量消耗植物**
                    let plantsToConsumeDueToHumans = Math.floor(human_count_g / 2);
                    let plantsActuallyConsumedThisCycle = 0;
                    if (plantsToConsumeDueToHumans > t_gameState.plantsConsumedByHumanPairs) {
                        let plantsToNewlyConsumeThisCycle = plantsToConsumeDueToHumans - t_gameState.plantsConsumedByHumanPairs;
                        let plantConsumedMessageSent = false;
                        for (let r_idx = 0; r_idx < 5 && plantsToNewlyConsumeThisCycle > 0; r_idx++) {
                            for (let c_idx = 0; c_idx < 4 && plantsToNewlyConsumeThisCycle > 0; c_idx++) {
                                if (workingGrid_g[r_idx][c_idx].content === "plant") {
                                    workingGrid_g[r_idx][c_idx].content = null; // 植物直接消失
                                    plantsToNewlyConsumeThisCycle--;
                                    plantsActuallyConsumedThisCycle++;
                                    plant_count_g--; // 实时更新植物数量计数
                                }
                            }
                        }
                        if (plantsActuallyConsumedThisCycle > 0 && !plantConsumedMessageSent) {
                           // 信息提示移到m_handleCellClick中，因为g_updateGameState会被其他事件触发
                           // f_addMessage(`因为人类数量达到${human_count_g}，${plantsActuallyConsumedThisCycle}株植物消失了。`);
                           // plantConsumedMessageSent = true;
                        }
                    }
    
    
                    workingGrid_g.flat().forEach((cell_g) => {
                        if ("plant" === cell_g.content) {
                            oxygen_level_g += cell_g.isFertile ? 10 : 1;
                        }
                    });
                    oxygen_level_g -= 5 * human_count_g;
                    oxygen_level_g = Math.max(0, Math.min(100, oxygen_level_g));
    
                    setGameState((current_gs_update) => ({
                      ...current_gs_update,
                      plantCount: plant_count_g,
                      humanCount: human_count_g,
                      tigerCount: tiger_count_g,
                      woodCount: wood_count_g,
                      oxygenLevel: oxygen_level_g,
                      grid: workingGrid_g,
                    plantsConsumedByHumanPairs: plantsToConsumeDueToHumans,
                    }));
                  }, [t_gameState.plantsConsumedByHumanPairs, f_addMessage]), // 添加f_addMessage到依赖
    
                (0, l_react.useEffect)(() => {
                  let gridCopy_death_eff = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))),
                    messages_arr_death_eff = [], changed_flag_death_eff = !1, decayingMessageShown_this_run_eff = !1, currentTime_decay_eff_val = Date.now();
    
                  gridCopy_death_eff.flat().forEach((cell_in_death_effect_val) => {
                    let r_death_eff_val = Math.floor(cell_in_death_effect_val.id / 4), a_death_eff_val = cell_in_death_effect_val.id % 4;
                    // 人类死亡判断 (要求4)
                    if (("human" === cell_in_death_effect_val.content && cell_in_death_effect_val.owner !== "human") || ("house" === cell_in_death_effect_val.content && "human" === cell_in_death_effect_val.owner)) {
                        const isOxygenLow_eff = t_gameState.oxygenLevel < 20;
                        const isOxygenHigh_eff = t_gameState.oxygenLevel > 30;
                        if (isOxygenLow_eff || isOxygenHigh_eff) {
                            const message_death_eff = isOxygenLow_eff ? "氧气浓度低于20%，人类窒息而亡！" : "氧气浓度高于30%，人类因含氧量超标死亡！";
                            messages_arr_death_eff.push(message_death_eff);
                            if ("human" === gridCopy_death_eff[r_death_eff_val][a_death_eff_val].owner) {
                                gridCopy_death_eff[r_death_eff_val][a_death_eff_val].owner = null;
                            } else {
                                gridCopy_death_eff[r_death_eff_val][a_death_eff_val].content = "human-dead";
                                gridCopy_death_eff[r_death_eff_val][a_death_eff_val].isDecaying = !0;
                                gridCopy_death_eff[r_death_eff_val][a_death_eff_val].decayEndTime = currentTime_decay_eff_val + 1000;
                            }
                            changed_flag_death_eff = !0;
                        }
                    }
                    else if (("human-dead" === cell_in_death_effect_val.content || "tiger-dead" === cell_in_death_effect_val.content) && cell_in_death_effect_val.isDecaying && currentTime_decay_eff_val >= cell_in_death_effect_val.decayEndTime) {
                      let decayingObjectName_death_eff = "human-dead" === cell_in_death_effect_val.content ? "骸骨" : "老虎残骸";
                      (gridCopy_death_eff[r_death_eff_val][a_death_eff_val].content = null);
                      (gridCopy_death_eff[r_death_eff_val][a_death_eff_val].isDecaying = !1);
                      (gridCopy_death_eff[r_death_eff_val][a_death_eff_val].decayEndTime = undefined);
                      (changed_flag_death_eff = !0);
                      if (!decayingMessageShown_this_run_eff) {
                         messages_arr_death_eff.push("一具".concat(decayingObjectName_death_eff, "风化消失了。"));
                         decayingMessageShown_this_run_eff = true;
                      }
                    }
                  });
                  messages_arr_death_eff.length > 0 && messages_arr_death_eff.forEach((msg) => f_addMessage(msg));
                  if (changed_flag_death_eff) {
                    g_updateGameState(gridCopy_death_eff);
                  }
                  // 定时器确保即使没有其他状态更新，也会检查decay (要求6)
                  const decayCheckIntervalId_eff = setInterval(() => {
                    let decayGridCopy_interval_eff = t_gameState.grid.map(row => row.map(cell => ({...cell})));
                    let decayOccurred_interval_eff = false;
                    let currentDecayTime_interval_eff = Date.now();
                    let decayMessages_interval_eff = [];
                    let decayingMessageShown_interval_run_eff = false;
    
                    decayGridCopy_interval_eff.flat().forEach(cell_interval_eff => {
                        if (("human-dead" === cell_interval_eff.content || "tiger-dead" === cell_interval_eff.content) && cell_interval_eff.isDecaying && currentDecayTime_interval_eff >= cell_interval_eff.decayEndTime) {
                            const r_eff_decay_interval_val = Math.floor(cell_interval_eff.id / 4);
                            const a_eff_decay_interval_val = cell_interval_eff.id % 4;
                            let decayingObjectName_interval_eff_val = "human-dead" === cell_interval_eff.content ? "骸骨" : "老虎残骸";
                            decayGridCopy_interval_eff[r_eff_decay_interval_val][a_eff_decay_interval_val].content = null;
                            decayGridCopy_interval_eff[r_eff_decay_interval_val][a_eff_decay_interval_val].isDecaying = !1;
                            decayGridCopy_interval_eff[r_eff_decay_interval_val][a_eff_decay_interval_val].decayEndTime = undefined;
                            decayOccurred_interval_eff = true;
                            if (!decayingMessageShown_interval_run_eff) {
                                 decayMessages_interval_eff.push("一具".concat(decayingObjectName_interval_eff_val, "风化消失了。"));
                                 decayingMessageShown_interval_run_eff = true;
                            }
                        }
                    });
                    if (decayOccurred_interval_eff) {
                        decayMessages_interval_eff.forEach(msg => f_addMessage(msg));
                        g_updateGameState(decayGridCopy_interval_eff);
                    }
                  }, 500);
    
                  return () => clearInterval(decayCheckIntervalId_eff);
                }, [t_gameState.oxygenLevel, t_gameState.grid, f_addMessage, g_updateGameState]),
                  (0, l_react.useEffect)(() => { // 处理火熄灭变灰烬
                    let e_gridCopy_fire_ext_eff2 = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))), fireExtinguished_flag_ext_eff2 = !1, currentTime_ext_eff2 = Date.now();
                    e_gridCopy_fire_ext_eff2.flat().forEach((cell_fire_ext_eff2) => { "fire" === cell_fire_ext_eff2.content && cell_fire_ext_eff2.fireEndTime && currentTime_ext_eff2 >= cell_fire_ext_eff2.fireEndTime && ((cell_fire_ext_eff2.content = "ash"), (cell_fire_ext_eff2.isFertile = !0), (cell_fire_ext_eff2.fireEndTime = void 0), (fireExtinguished_flag_ext_eff2 = !0), f_addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。")); });
                    fireExtinguished_flag_ext_eff2 && g_updateGameState(e_gridCopy_fire_ext_eff2);
                  }, [t_gameState.grid, f_addMessage, g_updateGameState]),
                  (0, l_react.useEffect)(() => { // 第三关倒计时和洪水 (要求7)
                    let interval_id_flood_eff2;
                    if (3 === t_gameState.currentLevel && t_gameState.timeLeft > 0 && !t_gameState.isGameOver)
                      interval_id_flood_eff2 = setInterval(() => { setGameState((gs_flood_timer_eff2) => ({ ...gs_flood_timer_eff2, timeLeft: gs_flood_timer_eff2.timeLeft - 1 })); }, 1e3);
                    else if (3 === t_gameState.currentLevel && 0 === t_gameState.timeLeft && !t_gameState.isGameOver) {
                      setGameState(gs_flood_start_eff => ({...gs_flood_start_eff, isRaining: true, isGameOver: true})); // 标记游戏结束以停止其他计时器
                      f_addMessage("120秒到！持续强降雨，引发洪水！");
                      setTimeout(() => {
                          let newGrid_after_flood_eff2 = t_gameState.grid.map((row_after_flood_eff2) =>
                              row_after_flood_eff2.map((cell_after_flood_eff2) => {
                                  let tempCell_after_flood_eff2 = { ...cell_after_flood_eff2 };
                                  if ("fire" === tempCell_after_flood_eff2.content) {
                                      tempCell_after_flood_eff2.content = "ash";
                                      tempCell_after_flood_eff2.isFertile = !0;
                                      tempCell_after_flood_eff2.fireEndTime = void 0;
                                  } else if ("ash" !== tempCell_after_flood_eff2.content) {
                                      tempCell_after_flood_eff2.content = null;
                                      tempCell_after_flood_eff2.owner = null;
                                      if ("ash" !== cell_after_flood_eff2.content) {
                                        tempCell_after_flood_eff2.isFertile = !1;
                                      }
                                  }
                                  tempCell_after_flood_eff2.isDecaying = !1;
                                  tempCell_after_flood_eff2.decayEndTime = undefined;
                                  return tempCell_after_flood_eff2;
                              })
                          );
                          setGameState((gs_flood_update_timeout_eff2) => ({
                              ...gs_flood_update_timeout_eff2,
                              grid: newGrid_after_flood_eff2,
                              messages: [...gs_flood_update_timeout_eff2.messages.slice(-5), "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。"],
                              woodCount: 0,
                              isRaining: false,
                              plantsConsumedByHumanPairs: 0,
                          }));
                          g_updateGameState(newGrid_after_flood_eff2);
                      }, 3000);
                    }
                    return () => clearInterval(interval_id_flood_eff2);
                  }, [t_gameState.currentLevel, t_gameState.timeLeft, t_gameState.isGameOver, f_addMessage, g_updateGameState, t_gameState.grid]),
                  x_saveHistory = () => {
                    setHistory((prevHistory_x_save_eff) => [...prevHistory_x_save_eff, JSON.parse(JSON.stringify(t_gameState))]);
                  },
                  m_handleCellClick = (row_idx_click_m_eff, col_idx_click_m_eff) => {
                      if (t_gameState.isGameOver && t_gameState.currentLevel === 3 && t_gameState.timeLeft === 0) {
                          f_addMessage("洪水过后，请点击“重新开始第三关”或进入其他关卡。");
                          return;
                      }
                    x_saveHistory();
                    let gridCopy_on_click_m_eff = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))),
                      clickedCell_on_click_m_eff = gridCopy_on_click_m_eff[row_idx_click_m_eff][col_idx_click_m_eff],
                      message_on_click_m_eff = "";
                    if (r_selectedItem) {
                      if (null === clickedCell_on_click_m_eff.content || ("ash" === clickedCell_on_click_m_eff.content && "plant" === r_selectedItem)) {
                        if ("plant" === r_selectedItem) {
                                const canPlant_eff = clickedCell_on_click_m_eff.isFertile ||
                                                "ash" === clickedCell_on_click_m_eff.content ||
                                                (t_gameState.currentLevel === 3 && t_gameState.timeLeft === 0 && !t_gameState.isRaining); // 允许洪水后种植
                          
                            if (canPlant_eff) {
                                    clickedCell_on_click_m_eff.content = "plant";
                                    if ("ash" === clickedCell_on_click_m_eff.content || clickedCell_on_click_m_eff.isFertile) {
                                        clickedCell_on_click_m_eff.isFertile = !0;
                                    }
                                    message_on_click_m_eff = "放置了 植物";
                                    setSelectedItem(null);
                                } else {
                                    message_on_click_m_eff = "土地贫瘠，植物无法生长！请先用火制造草木灰恢复地力。";
                                }
                            }
                        else if ("human" === r_selectedItem) {
                            // 要求5：老虎存在时不能放置人类（放置之后会被立刻吃掉）
                            if (t_gameState.tigerCount > 0 && !(clickedCell_on_click_m_eff.content === 'house' && clickedCell_on_click_m_eff.owner === null) ) {
                                message_on_click_m_eff = "刚放置的人类被老虎吃掉了！";
                                clickedCell_on_click_m_eff.content = "human-dead";
                                clickedCell_on_click_m_eff.isDecaying = true;
                                clickedCell_on_click_m_eff.decayEndTime = Date.now() + 1000;
                            } else {
                              	message_on_click_m_eff = "放置了 人";
                              	if (t_gameState.oxygenLevel < 20) {
                                	message_on_click_m_eff += "，但环境氧气浓度低于20%，人类窒息而亡！";
                                	clickedCell_on_click_m_eff.content = "human-dead";
                                	clickedCell_on_click_m_eff.isDecaying = !0;
                                    clickedCell_on_click_m_eff.decayEndTime = Date.now() + 1000;
                                } else if (t_gameState.oxygenLevel > 30) {
                                	message_on_click_m_eff += "，但环境氧气浓度高于30%，人类因含氧量超标死亡！";
                                	clickedCell_on_click_m_eff.content = "human-dead";
                                	clickedCell_on_click_m_eff.isDecaying = !0;
                                    clickedCell_on_click_m_eff.decayEndTime = Date.now() + 1000;
                              } else {
                                    clickedCell_on_click_m_eff.content = "human";
                                    // 人类放置不再直接消耗植物（要求2的核心）
                                    message_on_click_m_eff += "。";
                                }
                            }
                          setSelectedItem(null);
                        } else
                          "tiger" === r_selectedItem && ((clickedCell_on_click_m_eff.content = "tiger"), (message_on_click_m_eff = "放置了 老虎"), setSelectedItem(null));
                      } else
                        "human" === r_selectedItem && "house" === clickedCell_on_click_m_eff.content && null === clickedCell_on_click_m_eff.owner
                          ? ((clickedCell_on_click_m_eff.owner = "human"), (message_on_click_m_eff = "人住进了房子！"), setSelectedItem(null))
                          : (message_on_click_m_eff = "这个格子已经被占用了或操作无效！");
                    } else if ("plant" === clickedCell_on_click_m_eff.content) {
                      if (i_isTigerNearby(row_idx_click_m_eff, col_idx_click_m_eff, gridCopy_on_click_m_eff)) {
                        ((clickedCell_on_click_m_eff.content = "fire"), (clickedCell_on_click_m_eff.fireEndTime = Date.now() + 30000), (message_on_click_m_eff = h_handleFireEffect(gridCopy_on_click_m_eff, (message_on_click_m_eff = "植物在老虎的威胁下被点燃了！"))));
                      } else if (t_gameState.currentLevel >= 3 ) { // 要求8/10
                          clickedCell_on_click_m_eff.content = "fire";
                          clickedCell_on_click_m_eff.fireEndTime = Date.now() + 30000;
                          message_on_click_m_eff = "植物被点燃了。火焰熄灭后将形成草木灰并增加土壤肥力。";
                      } else if (t_gameState.currentLevel >= 2) {
                          ((clickedCell_on_click_m_eff.content = "wood"), (message_on_click_m_eff = "植物变成了木头！收集4块木头可以建造房子。"));
                      } else {
                          (message_on_click_m_eff = "点击植物。在第二关及以后，植物可以转化为木头。");
                      }
                    } else if ("wood" === clickedCell_on_click_m_eff.content && t_gameState.currentLevel >= 2) {
                      let woodId_click_m_wood_eff = clickedCell_on_click_m_eff.id;
                      if (!d_selectedWoods.includes(woodId_click_m_wood_eff)) {
                        let tempSelectedWoods_m_wood_eff = [...d_selectedWoods, woodId_click_m_wood_eff];
                        if ((setSelectedWoods(tempSelectedWoods_m_wood_eff), (message_on_click_m_eff = "选择了木头 (".concat(tempSelectedWoods_m_wood_eff.length, "/4)。")), 4 === tempSelectedWoods_m_wood_eff.length)) {
                          let housePlaced_flag_m_wood_eff = !1;
                          for (let r_house_m_wood_eff = 0; r_house_m_wood_eff < 5; r_house_m_wood_eff++) {
                            for (let c_house_m_wood_eff = 0; c_house_m_wood_eff < 4; c_house_m_wood_eff++)
                              if (null === gridCopy_on_click_m_eff[r_house_m_wood_eff][c_house_m_wood_eff].content || "ash" === gridCopy_on_click_m_eff[r_house_m_wood_eff][c_house_m_wood_eff].content) {
                                (gridCopy_on_click_m_eff[r_house_m_wood_eff][c_house_m_wood_eff].content = "house"),
                                (gridCopy_on_click_m_eff[r_house_m_wood_eff][c_house_m_wood_eff].isFertile = !0),
                                (message_on_click_m_eff = "4块木头合成了一座房子！"),
                                tempSelectedWoods_m_wood_eff.forEach((id_to_remove_wood_item_m_eff) => {
                                  gridCopy_on_click_m_eff[Math.floor(id_to_remove_wood_item_m_eff / 4)][id_to_remove_wood_item_m_eff % 4].content = null;
                                });
                                housePlaced_flag_m_wood_eff = !0; break;
                              }
                            if (housePlaced_flag_m_wood_eff) break;
                          }
                          housePlaced_flag_m_wood_eff || (message_on_click_m_eff = "没有空地建造房子！"), setSelectedWoods([]);
                        }
                      }
                    } else
                      "plant-dead" === clickedCell_on_click_m_eff.content
                        ? ((clickedCell_on_click_m_eff.content = "fire"), (clickedCell_on_click_m_eff.fireEndTime = Date.now() + 30000), (message_on_click_m_eff = h_handleFireEffect(gridCopy_on_click_m_eff, (message_on_click_m_eff = "枯叶被点燃，变成了火！"))))
                        : (message_on_click_m_eff = "请先选择一个物品，或点击植物/枯叶进行转化。");
    
                    // **老虎全局吃人逻辑 (要求5)** - 在任何有效操作后都可能触发
                    let currentTigerCount_eff = gridCopy_on_click_m_eff.flat().filter(c => c.content === 'tiger').length;
                    if (currentTigerCount_eff > 0) {
                        let humansEatenThisTurn = false;
                        for (let r_tg_eat_eff = 0; r_tg_eat_eff < 5; r_tg_eat_eff++) {
                            for (let c_tg_eat_eff = 0; c_tg_eat_eff < 4; c_tg_eat_eff++) {
                                // 检查当前格子是否是人并且不在房子里
                                if (gridCopy_on_click_m_eff[r_tg_eat_eff][c_tg_eat_eff].content === "human" && gridCopy_on_click_m_eff[r_tg_eat_eff][c_tg_eat_eff].owner !== "human") {
                                    gridCopy_on_click_m_eff[r_tg_eat_eff][c_tg_eat_eff].content = "human-dead";
                                    gridCopy_on_click_m_eff[r_tg_eat_eff][c_tg_eat_eff].isDecaying = true;
                                    gridCopy_on_click_m_eff[r_tg_eat_eff][c_tg_eat_eff].decayEndTime = Date.now() + 1000;
                                    if (!humansEatenThisTurn) { // 只提示一次（如果一回合吃多个）
                                       f_addMessage("老虎吃掉了位于(".concat(r_tg_eat_eff + 1, ",").concat(c_tg_eat_eff + 1, ")的不在房子里的人！"));
                                       humansEatenThisTurn = true; // 可以根据需要决定是否一次吃多个或只吃一个
                                    }
                                }
                            }
                        }
                    }
    
                    message_on_click_m_eff && f_addMessage(message_on_click_m_eff);
                    g_updateGameState(gridCopy_on_click_m_eff);
                  },
                  p_selectItem = (itemName_select_p_eff) => {
                    setSelectedItem(itemName_select_p_eff);
                    setSelectedWoods([]);
                    f_addMessage("选择了 ".concat("plant" === itemName_select_p_eff ? "植物" : "human" === itemName_select_p_eff ? "人" : "老虎"));
                  },
                  y_getCellIcon = (cell_icon_y_eff) =>
                    "plant" === cell_icon_y_eff.content ? "\uD83C\uDF3F"
                    : "plant-dead" === cell_icon_y_eff.content ? "\uD83C\uDF42"
                    : "human" === cell_icon_y_eff.content ? "\uD83E\uDDD1"
                    : "human-dead" === cell_icon_y_eff.content ? "\uD83D\uDC80"
                    : "tiger" === cell_icon_y_eff.content ? "\uD83D\uDC05"
                    : "tiger-dead" === cell_icon_y_eff.content ? "☠️"
                    : "fire" === cell_icon_y_eff.content ? "\uD83D\uDD25"
                    : "wood" === cell_icon_y_eff.content ? (d_selectedWoods.includes(cell_icon_y_eff.id) ? "\uD83E\uDEB5✨" : "\uD83E\uDEB5")
                    : "house" === cell_icon_y_eff.content ? ("human" === cell_icon_y_eff.owner ? "\uD83C\uDFE0\uD83E\uDDD1" : "\uD83C\uDFE0")
                    : "ash" === cell_icon_y_eff.content ? "\uD83E\uDEA8" : "",
                  b_getCellStyle = (cell_style_b_eff) => {
                    let bgColor_cell_b_eff = "#D2B48C";
                    return (
                      "fire" === cell_style_b_eff.content ? (bgColor_cell_b_eff = "#ffcc80")
                      : "ash" === cell_style_b_eff.content ? (bgColor_cell_b_eff = "#A9A9A9")
                      : cell_style_b_eff.isFertile || (bgColor_cell_b_eff = "#E0C9A6"), // 贫瘠土地颜色
                      {
                        border: "1px solid #a5d6a7", backgroundColor: bgColor_cell_b_eff, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "2.5em",
                        cursor: "pointer", transition: "background-color 0.3s ease, transform 0.1s ease",
                        borderRadius: "4px", boxShadow: d_selectedWoods.includes(cell_style_b_eff.id) ? "0 0 5px 2px yellow" : "none",
                      }
                    );
                  },
                  buttonStyle_render_final = { padding: "10px 15px", fontSize: "1em", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", margin: "5px" },
                  textStyle_render_final = { margin: "5px 0", fontSize: "0.9em", color: "black" },
                  headerStyle_render_final = { color: "black", marginTop: "15px", flexShrink: 0 },
                  timerStyle_render_final = { textAlign: "center", color: t_gameState.timeLeft < 10 ? "red" : t_gameState.timeLeft < 60 ? "#f57c00" : "black", marginTop: "0", marginBottom: "10px", flexShrink: 0 };
    
                    const selectableItems_render = [
                        { name: "plant", label: "植物 \uD83C\uDF3F" },
                        { name: "human", label: "人 \uD83E\uDDD1" },
                    ];
                    if (t_gameState.currentLevel > 1) { // 要求1：第一关不显示老虎
                        selectableItems_render.push({ name: "tiger", label: "老虎 \uD83D\uDC05" });
                    }
    
                return (0, o_jsx.jsx)("div", {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", width: "100vw", padding: "0px", margin: "0px", boxSizing: "border-box", backgroundColor: "#001f3f" },
                  children: (0, o_jsx.jsxs)("div", {
                    style: { position:"relative", display: "flex", flexDirection: "row", backgroundColor: "#e0f2f1", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "100%", height: "100%", maxWidth: "1200px", maxHeight: "95vh", boxSizing: "border-box", overflow: "hidden" },
                    children: [
                      t_gameState.isRaining && (0, o_jsx.jsx)("div", {
                        style: {
                            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                            backgroundColor: "rgba(100,100,150,0.3)",
                            zIndex: 1000, pointerEvents: "none", display: "flex",
                            justifyContent: "center", alignItems: "flex-start", overflow: "hidden"
                        },
                        children: Array.from({ length: 50 }).map((_, idx) => (0, o_jsx.jsx)("div", {
                            style: {
                                position: "absolute", left: "".concat(Math.random() * 100, "%"),
                                width: "2px", height: "".concat(10 + Math.random() * 10, "px"),
                                backgroundColor: "rgba(173, 216, 230, 0.7)",
                                animation: "fall ".concat(0.5 + Math.random() * 0.5, "s linear infinite"),
                                animationDelay: "".concat(Math.random() * 3, "s")
                            }
                        }, "rain-".concat(idx)))
                      }),
                      (0, o_jsx.jsx)("style", {
                        children: ` @keyframes fall { to { transform: translateY(95vh); opacity: 0; } } `
                      }),
                      (0, o_jsx.jsxs)("div", {
                        style: { flexGrow: 1, marginRight: "20px", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "10px" },
                        children: [
                          (0, o_jsx.jsx)("h1", { style: { textAlign: "center", fontSize: "1.5em", color: "#2e7d32", marginBottom: "5px", flexShrink: 0 }, children: "创设氧气浓度适宜生物多样化的环境" }),
                          (0, o_jsx.jsxs)("h2", { style: { textAlign: "center", fontSize: "1.2em", color: "#4caf50", marginTop: "0", marginBottom: "10px", flexShrink: 0 }, children: ["当前关卡：", t_gameState.currentLevel] }),
                          3 === t_gameState.currentLevel && !t_gameState.isGameOver && (0, o_jsx.jsxs)("h3", { style: timerStyle_render_final, children: ["倒计时: ", t_gameState.timeLeft, "s"] }),
                          (0, o_jsx.jsx)("div", {
                            style: { display: "grid", gridTemplateColumns: "repeat(".concat(4, ", 80px)"), gridTemplateRows: "repeat(".concat(5, ", 80px)"), gap: "5px", border: "2px solid #a5d6a7", margin: "20px auto", backgroundColor: "#c8e6c9", borderRadius: "8px", padding: "5px" },
                            children: t_gameState.grid.flat().map((cell_data_final_map_render_val) =>
                              (0, o_jsx.jsx)("div", {
                                onClick: () => m_handleCellClick(Math.floor(cell_data_final_map_render_val.id / 4), cell_data_final_map_render_val.id % 4),
                                style: b_getCellStyle(cell_data_final_map_render_val),
                                title: cell_data_final_map_render_val.content || (cell_data_final_map_render_val.isFertile ? ("ash" === cell_data_final_map_render_val.content ? "草木灰土地" : "空地") : "贫瘠土地"),
                                onMouseEnter: (e_hover_final_render_val) => (e_hover_final_render_val.currentTarget.style.transform = "scale(1.05)"),
                                onMouseLeave: (e_hover_final_render_val) => (e_hover_final_render_val.currentTarget.style.transform = "scale(1)"),
                                children: y_getCellIcon(cell_data_final_map_render_val),
                              }, cell_data_final_map_render_val.id)
                            ),
                          }),
                          (0, o_jsx.jsxs)("div", {
                            style: { textAlign: "center", marginTop: "20px", flexShrink: 0 },
                            children: [
                              (0, o_jsx.jsx)("button", { onClick: () => { c_history.length > 0 && (setGameState(c_history[c_history.length - 1]), setHistory(c_history.slice(0, -1)), setSelectedWoods([]), f_addMessage("操作已撤销")); }, style: buttonStyle_render_final, children: "撤销" }),
                              (0, o_jsx.jsx)("button", {
                                onClick: () => {
                                  x_saveHistory(); let nextLevel_final_render_val = t_gameState.currentLevel < 3 ? t_gameState.currentLevel + 1 : (t_gameState.isGameOver && t_gameState.timeLeft === 0 ? 3 : t_gameState.currentLevel + 1 > 3 ? 1 : t_gameState.currentLevel + 1);
                                    if (t_gameState.currentLevel === 3 && t_gameState.isGameOver) { // If game over at level 3, next level button becomes "Play Again" or similar for level 1 or 3
                                        nextLevel_final_render_val = 3; // Or 1 if you want to restart from beginning
                                        f_addMessage("重新开始第三关");
                                    } else {
                                        f_addMessage(3 === t_gameState.currentLevel ? "重新开始当前关卡" : "进入关卡 ".concat(nextLevel_final_render_val));
                                    }
                                  setGameState((gs_nextLevel_final_render_val) => ({ ...gs_nextLevel_final_render_val, currentLevel: nextLevel_final_render_val, grid: e_initializeGrid(), oxygenLevel: 0, plantCount: 0, humanCount: 0, tigerCount: 0, woodCount: 0, timeLeft: 120, isGameOver: false, messages: ["欢迎来到关卡 ".concat(nextLevel_final_render_val)], plantsConsumedByHumanPairs: 0 }));
                                  setSelectedWoods([]), g_updateGameState(e_initializeGrid());
                                },
                                style: { ...buttonStyle_render_final, marginLeft: "10px" },
                                children: (t_gameState.currentLevel === 3 && t_gameState.isGameOver && t_gameState.timeLeft === 0) ? "重新开始第三关" : (3 === t_gameState.currentLevel ? "重新开始当前关卡" : "进入下一关"),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, o_jsx.jsxs)("div", {
                        style: { width: "300px", paddingLeft: "20px", borderLeft: "1px solid #bcaaa4", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0, padding: "10px" },
                        children: [
                          (0, o_jsx.jsx)("h3", { style: headerStyle_render_final, children: "可选生物/物品:" }),
                          (0, o_jsx.jsx)("div", {
                            style: { marginBottom: "15px", flexShrink: 0 },
                            children: selectableItems_render.map((item_data_final_map_render_val) =>
                              (0, o_jsx.jsx)("button", {
                                onClick: () => p_selectItem(item_data_final_map_render_val.name),
                                style: { padding: "10px", margin: "5px 0", width: "100%", fontSize: "1em", cursor: "pointer", backgroundColor: r_selectedItem === item_data_final_map_render_val.name ? "#a5d6a7" : "#fff", border: "1px solid #a5d6a7", borderRadius: "5px", color: "#333", textAlign: "left" },
                                children: item_data_final_map_render_val.label,
                              }, item_data_final_map_render_val.name)
                            ),
                          }),
                          (0, o_jsx.jsx)("h3", { style: headerStyle_render_final, children: "状态显示:" }),
                          (0, o_jsx.jsxs)("div", {
                            style: { marginBottom: "10px", flexShrink: 0 },
                            children: [
                              (0, o_jsx.jsxs)("p", { style: textStyle_render_final, children: ["氧气浓度: ", t_gameState.oxygenLevel, "%"] }),
                              (0, o_jsx.jsx)("div", {
                                style: { width: "100%", backgroundColor: "#ddd", borderRadius: "3px", height: "20px", overflow: "hidden" },
                                children: (0, o_jsx.jsx)("div", { style: { width: "".concat(t_gameState.oxygenLevel, "%"), backgroundColor: t_gameState.oxygenLevel < 20 || t_gameState.oxygenLevel > 30 ? "#f44336" : "#4caf50", height: "100%", borderRadius: "3px", transition: "width 0.5s ease-in-out" } }),
                              }),
                            ],
                          }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render_final, children: ["植物数量: ", t_gameState.plantCount, " \uD83C\uDF3F"] }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render_final, children: ["人类数量: ", t_gameState.humanCount, " \uD83E\uDDD1"] }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render_final, children: ["老虎数量: ", t_gameState.tigerCount, " \uD83D\uDC05"] }),
                          (0, o_jsx.jsxs)("p", { style: textStyle_render_final, children: ["木头数量: ", t_gameState.woodCount, " \uD83E\uDEB5"] }),
                          (0, o_jsx.jsx)("h3", { style: headerStyle_render_final, children: "信息提示:" }),
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