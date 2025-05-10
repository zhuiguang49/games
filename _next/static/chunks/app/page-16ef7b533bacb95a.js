(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
        [974],
        {
          3662: (e, t, n) => {
            Promise.resolve().then(n.bind(n, 5288));
          },
          5288: (e_module, t_exports, n_require) => { // 模块参数，通常为 e, t, n
            "use strict";
            n_require.d(t_exports, { default: () => r_GameComponent });
            var o_jsxRuntime = n_require(2860), // o
              l_react = n_require(3200); // l
    
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
                    [, , , , ,].fill(null).map((e_ignored_row, t_rowIndex) =>
                        [, , , ,].fill(null).map((e_ignored_col, n_colIndex) => ({
                            id: 4 * t_rowIndex + n_colIndex,
                            content: null,
                            isFertile: !0,
                            owner: null,
                            isDecaying: !1,
                            decayEndTime: undefined,
                        }))
                      );
    
                  const [t_gameState, n_setGameState] = (0, l_react.useState)({ // t 是 gameState, n 是 setGameState
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
    
                  const [r_selectedItem, a_setSelectedItem] = (0, l_react.useState)(null); // r 是 selectedItem, a 是 setSelectedItem
                  const [c_history, s_setHistory] = (0, l_react.useState)([]); // c 是 history, s 是 setHistory
                  const [d_selectedWoods, u_setSelectedWoods] = (0, l_react.useState)([]); // d 是 selectedWoods, u 是 setSelectedWoods
    
                  const f_addMessage = (0, l_react.useCallback)((e_messageText) => { // f 是 addMessage, e 是 messageText
                    n_setGameState((t_prevState) => ({ ...t_prevState, messages: [...t_prevState.messages.slice(-5), e_messageText] }));
                  }, []);
    
                  const h_handleFireEffect = (0, l_react.useCallback)((e_currentGrid, t_messageLog) => { // h 是 handleFireEffect
                    let n_newMessageLog = t_messageLog;
                    if (e_currentGrid.flat().filter((cell) => "fire" === cell.content).length >= 2) {
                      for (let r_row = 0; r_row < 5; r_row++) {
                        for (let c_col = 0; c_col < 4; c_col++) {
                          if ("tiger" === e_currentGrid[r_row][c_col].content) {
                            let fire_sources = 0;
                            for (let [dr, dc] of [[-1, 0],[1, 0],[0, -1],[0, 1]]) {
                              let adj_r = r_row + dr, adj_c = c_col + dc;
                              if (adj_r >= 0 && adj_r < 5 && adj_c >= 0 && adj_c < 4 && "fire" === e_currentGrid[adj_r][adj_c].content) {
                                    fire_sources++;
                                }
                            }
                            if (fire_sources >= 2) {
                              e_currentGrid[r_row][c_col].content = "tiger-dead";
                              e_currentGrid[r_row][c_col].isDecaying = !0;
                                e_currentGrid[r_row][c_col].decayEndTime = Date.now() + 1000;
                              n_newMessageLog += " 两团火的热量消灭了一只老虎！";
                                return n_newMessageLog;
                            }
                          }
                        }
                      }
                    }
                    return n_newMessageLog;
                  }, []);
    
                  const g_updateGameState = (0, l_react.useCallback)((e_grid_param_g) => { // g is updateGameState, e is grid
                    let workingGrid = e_grid_param_g.map(row => row.map(cell => ({...cell})));
                    let t_plantCount_g = 0, o_humanCount_g = 0, l_tigerCount_g = 0, i_woodCount_g = 0, r_oxygenLevel_g = 0;
    
                    workingGrid.flat().forEach((cell_g_iter) => {
                        if ("plant" === cell_g_iter.content) t_plantCount_g++;
                        if (("human" === cell_g_iter.content || "human" === cell_g_iter.owner)) o_humanCount_g++;
                        if ("tiger" === cell_g_iter.content) l_tigerCount_g++;
                        if ("wood" === cell_g_iter.content) i_woodCount_g++;
                    });
    
                    // **要求2 实现：根据人类数量消耗植物**
                    let plantsToConsumeTotal_g = Math.floor(o_humanCount_g / 2);
                    let plantsActuallyConsumedThisCycle_g = 0;
                    // **重要**: 访问 t_gameState (外部作用域的 `t`) 来获取 `plantsConsumedByHumanPairs`
                    if (plantsToConsumeTotal_g > t_gameState.plantsConsumedByHumanPairs) {
                        let plantsToNewlyConsume_g = plantsToConsumeTotal_g - t_gameState.plantsConsumedByHumanPairs;
                        let plantConsumedMessageSent_g = false; // To avoid multiple messages in one update cycle
                        for (let r_idx_g = 0; r_idx_g < 5 && plantsToNewlyConsume_g > 0; r_idx_g++) {
                            for (let c_idx_g = 0; c_idx_g < 4 && plantsToNewlyConsume_g > 0; c_idx_g++) {
                                if (workingGrid[r_idx_g][c_idx_g].content === "plant") {
                                    workingGrid[r_idx_g][c_idx_g].content = null;
                                    plantsToNewlyConsume_g--;
                                    plantsActuallyConsumedThisCycle_g++;
                                    t_plantCount_g--; // 更新实时植物数量
                                }
                            }
                        }
                        if (plantsActuallyConsumedThisCycle_g > 0 && !plantConsumedMessageSent_g) {
                            // 消息提示移动到 m_handleCellClick 以便更准确地反映是哪个操作触发的
                            // f_addMessage(`因为人类数量达到${o_humanCount_g}，${plantsActuallyConsumedThisCycle_g}株植物消失了。`);
                            // plantConsumedMessageSent_g = true;
                        }
                    }
    
                    // 重新计算植物产氧 (因为上面可能有植物消失了)
                    r_oxygenLevel_g = 0; // 重置氧气生产计数器
                    workingGrid.flat().forEach((cell_g_oxygen) => {
                        if ("plant" === cell_g_oxygen.content) {
                            r_oxygenLevel_g += cell_g_oxygen.isFertile ? 10 : 1;
                        }
                    });
    
                    r_oxygenLevel_g -= 5 * o_humanCount_g;
                    r_oxygenLevel_g = Math.max(0, Math.min(100, r_oxygenLevel_g));
    
                    n_setGameState((current_gs_from_g_update) => ({
                      ...current_gs_from_g_update,
                      plantCount: t_plantCount_g,
                      humanCount: o_humanCount_g,
                      tigerCount: l_tigerCount_g,
                      woodCount: i_woodCount_g,
                      oxygenLevel: r_oxygenLevel_g,
                      grid: workingGrid,
                    plantsConsumedByHumanPairs: plantsToConsumeTotal_g,
                    }));
                // **修正: 依赖项应该是 t_gameState (即外部的 `t`) 而不是模块参数 `t`**
                  }, [f_addMessage, t_gameState.plantsConsumedByHumanPairs]);
    
                (0, l_react.useEffect)(() => { // 人类死亡与风化
                  let e_gridCopy_death_eff_val = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))),
                    messages_arr_death_eff_val = [], changed_flag_death_eff_val = !1, decayingMessageShown_this_run_eff_val = !1, currentTime_decay_eff_val_time = Date.now();
    
                  e_gridCopy_death_eff_val.flat().forEach((cell_in_death_eff_val_iter) => {
                    let r_death_eff_val_idx = Math.floor(cell_in_death_eff_val_iter.id / 4), a_death_eff_val_idx = cell_in_death_eff_val_iter.id % 4;
                    // 人类死亡判断 (要求3, 4)
                    if (("human" === cell_in_death_eff_val_iter.content && cell_in_death_eff_val_iter.owner !== "human") || ("house" === cell_in_death_eff_val_iter.content && "human" === cell_in_death_eff_val_iter.owner)) {
                        const isOxygenLow_death_eff = t_gameState.oxygenLevel < 20;
                        const isOxygenHigh_death_eff = t_gameState.oxygenLevel > 30;
                        if (isOxygenLow_death_eff || isOxygenHigh_death_eff) {
                            const message_death_reason = isOxygenLow_death_eff ? "氧气浓度低于20%，人类窒息而亡！" : "氧气浓度高于30%，人类因含氧量超标死亡！";
                            messages_arr_death_eff_val.push(message_death_reason);
                            if ("human" === e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].owner) {
                                e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].owner = null;
                            } else {
                                e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].content = "human-dead";
                                e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].isDecaying = !0;
                                e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].decayEndTime = currentTime_decay_eff_val_time + 1000;
                            }
                            changed_flag_death_eff_val = !0;
                        }
                    }
                    else if (("human-dead" === cell_in_death_eff_val_iter.content || "tiger-dead" === cell_in_death_eff_val_iter.content) && cell_in_death_eff_val_iter.isDecaying && cell_in_death_eff_val_iter.decayEndTime !== undefined && currentTime_decay_eff_val_time >= cell_in_death_eff_val_iter.decayEndTime) {
                      let decayingObjectName_death_eff_val = "human-dead" === cell_in_death_eff_val_iter.content ? "骸骨" : "老虎残骸";
                      (e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].content = null);
                      (e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].isDecaying = !1);
                      (e_gridCopy_death_eff_val[r_death_eff_val_idx][a_death_eff_val_idx].decayEndTime = undefined);
                      (changed_flag_death_eff_val = !0);
                      if (!decayingMessageShown_this_run_eff_val) {
                         messages_arr_death_eff_val.push("一具".concat(decayingObjectName_death_eff_val, "风化消失了。"));
                         decayingMessageShown_this_run_eff_val = true;
                      }
                    }
                  });
                  messages_arr_death_eff_val.length > 0 && messages_arr_death_eff_val.forEach((msg_death) => f_addMessage(msg_death));
                  if (changed_flag_death_eff_val) {
                    g_updateGameState(e_gridCopy_death_eff_val);
                  }
                  // 要求6：定时器确保即使没有其他状态更新，也会检查decay
                  const decayCheckIntervalId_eff_val = setInterval(() => {
                    let decayGridCopy_interval_eff_val = t_gameState.grid.map(row => row.map(cell => ({...cell}))); // 使用最新的 t_gameState.grid
                    let decayOccurred_interval_eff_val = false;
                    let currentDecayTime_interval_eff_val = Date.now();
                    let decayMessages_interval_eff_val = [];
                    let decayingMessageShown_interval_run_eff_val = false;
    
                    decayGridCopy_interval_eff_val.flat().forEach(cell_interval_eff_val => {
                        if (("human-dead" === cell_interval_eff_val.content || "tiger-dead" === cell_interval_eff_val.content) && cell_interval_eff_val.isDecaying && cell_interval_eff_val.decayEndTime !== undefined && currentDecayTime_interval_eff_val >= cell_interval_eff_val.decayEndTime) {
                            const r_eff_decay_interval_val_idx = Math.floor(cell_interval_eff_val.id / 4);
                            const a_eff_decay_interval_val_idx = cell_interval_eff_val.id % 4;
                            let decayingObjectName_interval_eff_val_name = "human-dead" === cell_interval_eff_val.content ? "骸骨" : "老虎残骸";
                            decayGridCopy_interval_eff_val[r_eff_decay_interval_val_idx][a_eff_decay_interval_val_idx].content = null;
                            decayGridCopy_interval_eff_val[r_eff_decay_interval_val_idx][a_eff_decay_interval_val_idx].isDecaying = !1;
                            decayGridCopy_interval_eff_val[r_eff_decay_interval_val_idx][a_eff_decay_interval_val_idx].decayEndTime = undefined;
                            decayOccurred_interval_eff_val = true;
                            if (!decayingMessageShown_interval_run_eff_val) {
                                 decayMessages_interval_eff_val.push("一具".concat(decayingObjectName_interval_eff_val_name, "风化消失了。"));
                                 decayingMessageShown_interval_run_eff_val = true;
                            }
                        }
                    });
                    if (decayOccurred_interval_eff_val) {
                        decayMessages_interval_eff_val.forEach(msg_decay_interval => f_addMessage(msg_decay_interval));
                        setGameState(prev => ({...prev, grid: decayGridCopy_interval_eff_val })); // 直接用 setGameState 更新 grid
                    }
                  }, 500);
    
                  return () => clearInterval(decayCheckIntervalId_eff_val);
                }, [t_gameState.oxygenLevel, t_gameState.grid, f_addMessage, g_updateGameState, n_setGameState]), // n_setGameState 加入依赖，确保interval内能拿到最新setGameState
    
                  (0, l_react.useEffect)(() => { // 处理火熄灭变灰烬
                    let e_gridCopy_fire_ext_eff3 = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))), fireExtinguished_flag_ext_eff3 = !1, currentTime_ext_eff3 = Date.now();
                    e_gridCopy_fire_ext_eff3.flat().forEach((cell_fire_ext_eff3) => { "fire" === cell_fire_ext_eff3.content && cell_fire_ext_eff3.fireEndTime && currentTime_ext_eff3 >= cell_fire_ext_eff3.fireEndTime && ((cell_fire_ext_eff3.content = "ash"), (cell_fire_ext_eff3.isFertile = !0), (cell_fire_ext_eff3.fireEndTime = void 0), (fireExtinguished_flag_ext_eff3 = !0), f_addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。")); });
                    fireExtinguished_flag_ext_eff3 && g_updateGameState(e_gridCopy_fire_ext_eff3);
                  }, [t_gameState.grid, f_addMessage, g_updateGameState]),
    
                  (0, l_react.useEffect)(() => { // 第三关倒计时和洪水 (要求7)
                    let interval_id_flood_eff3;
                    if (3 === t_gameState.currentLevel && t_gameState.timeLeft > 0 && !t_gameState.isGameOver) {
                      interval_id_flood_eff3 = setInterval(() => { n_setGameState((gs_flood_timer_eff3) => ({ ...gs_flood_timer_eff3, timeLeft: gs_flood_timer_eff3.timeLeft - 1 })); }, 1e3);
                    }
                    else if (3 === t_gameState.currentLevel && 0 === t_gameState.timeLeft && !t_gameState.isGameOver) {
                      n_setGameState(gs_flood_start_eff3 => ({...gs_flood_start_eff3, isRaining: true, isGameOver: true}));
                      f_addMessage("120秒到！持续强降雨，引发洪水！");
                      setTimeout(() => {
                          const currentGridBeforeFlood = t_gameState.grid; // Capture grid at the moment timeout is set
                          let newGrid_after_flood_eff3 = currentGridBeforeFlood.map((row_after_flood_eff3) =>
                              row_after_flood_eff3.map((cell_after_flood_eff3) => {
                                  let tempCell_after_flood_eff3 = { ...cell_after_flood_eff3 };
                                  if ("fire" === tempCell_after_flood_eff3.content) {
                                      tempCell_after_flood_eff3.content = "ash";
                                      tempCell_after_flood_eff3.isFertile = !0;
                                      tempCell_after_flood_eff3.fireEndTime = void 0;
                                  } else if ("ash" !== tempCell_after_flood_eff3.content) {
                                      tempCell_after_flood_eff3.content = null;
                                      tempCell_after_flood_eff3.owner = null;
                                      if ("ash" !== cell_after_flood_eff3.content) {
                                        tempCell_after_flood_eff3.isFertile = !1;
                                      }
                                  }
                                  tempCell_after_flood_eff3.isDecaying = !1;
                                  tempCell_after_flood_eff3.decayEndTime = undefined;
                                  return tempCell_after_flood_eff3;
                              })
                          );
                          n_setGameState((gs_flood_update_timeout_eff3) => ({
                              ...gs_flood_update_timeout_eff3,
                              grid: newGrid_after_flood_eff3,
                              messages: [...gs_flood_update_timeout_eff3.messages.slice(-5), "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。"],
                              woodCount: 0,
                              isRaining: false,
                              plantsConsumedByHumanPairs: 0,
                          }));
                          // g_updateGameState(newGrid_after_flood_eff3); // setGameState will trigger re-render and useEffects which in turn call g_updateGameState
                      }, 3000);
                    }
                    return () => clearInterval(interval_id_flood_eff3);
                  }, [t_gameState.currentLevel, t_gameState.timeLeft, t_gameState.isGameOver, f_addMessage, t_gameState.grid, n_setGameState, g_updateGameState]), // Added t_gameState.grid, n_setGameState and g_updateGameState
    
                  x_saveHistory = () => {
                    s_setHistory((prevHistory_x_save_eff2) => [...prevHistory_x_save_eff2, JSON.parse(JSON.stringify(t_gameState))]);
                  },
                  m_handleCellClick = (row_idx_click_m_eff2, col_idx_click_m_eff2) => {
                      if (t_gameState.isGameOver && t_gameState.currentLevel === 3 && t_gameState.timeLeft === 0) {
                          f_addMessage("洪水过后，游戏已结束。请点击“重新开始第三关”或进入其他关卡。");
                          return;
                      }
                    x_saveHistory();
                    let gridCopy_on_click_m_eff2 = t_gameState.grid.map((row) => row.map((cell) => ({ ...cell }))),
                      clickedCell_on_click_m_eff2 = gridCopy_on_click_m_eff2[row_idx_click_m_eff2][col_idx_click_m_eff2],
                      message_on_click_m_eff2 = "";
                    if (r_selectedItem) {
                      if (null === clickedCell_on_click_m_eff2.content || ("ash" === clickedCell_on_click_m_eff2.content && "plant" === r_selectedItem)) {
                        if ("plant" === r_selectedItem) {
                                const canPlant_eff2 = clickedCell_on_click_m_eff2.isFertile ||
                                                "ash" === clickedCell_on_click_m_eff2.content ||
                                                (t_gameState.currentLevel === 3 && t_gameState.timeLeft === 0 && !t_gameState.isRaining);
                          
                            if (canPlant_eff2) {
                                    clickedCell_on_click_m_eff2.content = "plant";
                                    if ("ash" === clickedCell_on_click_m_eff2.content || clickedCell_on_click_m_eff2.isFertile) { // Planted on ash or already fertile
                                        clickedCell_on_click_m_eff2.isFertile = !0;
                                    } // If planted on barren post-flood, isFertile remains false
                                    message_on_click_m_eff2 = "放置了 植物";
                                    a_setSelectedItem(null);
                                } else {
                                    message_on_click_m_eff2 = "土地贫瘠，植物无法生长！请先用火制造草木灰恢复地力。";
                                }
                            }
                        else if ("human" === r_selectedItem) {
                            // 要求5：老虎存在时，新放置的人类（如果不在房子里）会立刻被吃掉
                            const isProtectedByHouse = clickedCell_on_click_m_eff2.content === 'house' && clickedCell_on_click_m_eff2.owner === null;
                            if (t_gameState.tigerCount > 0 && !isProtectedByHouse ) {
                                message_on_click_m_eff2 = "刚放置的人类被老虎吃掉了！";
                                clickedCell_on_click_m_eff2.content = "human-dead";
                                clickedCell_on_click_m_eff2.isDecaying = true;
                                clickedCell_on_click_m_eff2.decayEndTime = Date.now() + 1000;
                            } else {
                              	message_on_click_m_eff2 = "放置了 人";
                              	if (t_gameState.oxygenLevel < 20) {
                                	message_on_click_m_eff2 += "，但环境氧气浓度低于20%，人类窒息而亡！";
                                    if(isProtectedByHouse) clickedCell_on_click_m_eff2.owner = 'human-dead-in-house'; // Special state or just remove owner
                                    else clickedCell_on_click_m_eff2.content = "human-dead";
                                	clickedCell_on_click_m_eff2.isDecaying = !0;
                                    clickedCell_on_click_m_eff2.decayEndTime = Date.now() + 1000;
                                } else if (t_gameState.oxygenLevel > 30) {
                                	message_on_click_m_eff2 += "，但环境氧气浓度高于30%，人类因含氧量超标死亡！";
                                    if(isProtectedByHouse) clickedCell_on_click_m_eff2.owner = 'human-dead-in-house';
                                    else clickedCell_on_click_m_eff2.content = "human-dead";
                                	clickedCell_on_click_m_eff2.isDecaying = !0;
                                    clickedCell_on_click_m_eff2.decayEndTime = Date.now() + 1000;
                              } else {
                                    if(isProtectedByHouse) clickedCell_on_click_m_eff2.owner = "human";
                                    else clickedCell_on_click_m_eff2.content = "human";
                                    message_on_click_m_eff2 += "。";
                                }
                            }
                          a_setSelectedItem(null);
                        } else
                          "tiger" === r_selectedItem && ((clickedCell_on_click_m_eff2.content = "tiger"), (message_on_click_m_eff2 = "放置了 老虎"), a_setSelectedItem(null));
                      } else
                        "human" === r_selectedItem && "house" === clickedCell_on_click_m_eff2.content && null === clickedCell_on_click_m_eff2.owner
                          ? ((clickedCell_on_click_m_eff2.owner = "human"), (message_on_click_m_eff2 = "人住进了房子！"), a_setSelectedItem(null))
                          : (message_on_click_m_eff2 = "这个格子已经被占用了或操作无效！");
                    } else if ("plant" === clickedCell_on_click_m_eff2.content) {
                      if (i_isTigerNearby(row_idx_click_m_eff2, col_idx_click_m_eff2, gridCopy_on_click_m_eff2)) {
                        ((clickedCell_on_click_m_eff2.content = "fire"), (clickedCell_on_click_m_eff2.fireEndTime = Date.now() + 30000), (message_on_click_m_eff2 = h_handleFireEffect(gridCopy_on_click_m_eff2, (message_on_click_m_eff2 = "植物在老虎的威胁下被点燃了！"))));
                      } else if (t_gameState.currentLevel >= 3) { // 要求8/10
                          clickedCell_on_click_m_eff2.content = "fire";
                          clickedCell_on_click_m_eff2.fireEndTime = Date.now() + 30000;
                          message_on_click_m_eff2 = "植物被点燃了。火焰熄灭后将形成草木灰并增加土壤肥力。";
                      } else if (t_gameState.currentLevel >= 2) {
                          ((clickedCell_on_click_m_eff2.content = "wood"), (message_on_click_m_eff2 = "植物变成了木头！收集4块木头可以建造房子。"));
                      } else {
                          (message_on_click_m_eff2 = "点击植物。在第二关及以后，植物可以转化为木头。");
                      }
                    } else if ("wood" === clickedCell_on_click_m_eff2.content && t_gameState.currentLevel >= 2) {
                      let woodId_click_m_wood_eff2 = clickedCell_on_click_m_eff2.id;
                      if (!d_selectedWoods.includes(woodId_click_m_wood_eff2)) {
                        let tempSelectedWoods_m_wood_eff2 = [...d_selectedWoods, woodId_click_m_wood_eff2];
                        if ((u_setSelectedWoods(tempSelectedWoods_m_wood_eff2), (message_on_click_m_eff2 = "选择了木头 (".concat(tempSelectedWoods_m_wood_eff2.length, "/4)。")), 4 === tempSelectedWoods_m_wood_eff2.length)) {
                          let housePlaced_flag_m_wood_eff2 = !1;
                          for (let r_house_m_wood_eff2 = 0; r_house_m_wood_eff2 < 5; r_house_m_wood_eff2++) {
                            for (let c_house_m_wood_eff2 = 0; c_house_m_wood_eff2 < 4; c_house_m_wood_eff2++)
                              if (null === gridCopy_on_click_m_eff2[r_house_m_wood_eff2][c_house_m_wood_eff2].content || "ash" === gridCopy_on_click_m_eff2[r_house_m_wood_eff2][c_house_m_wood_eff2].content) {
                                (gridCopy_on_click_m_eff2[r_house_m_wood_eff2][c_house_m_wood_eff2].content = "house"),
                                (gridCopy_on_click_m_eff2[r_house_m_wood_eff2][c_house_m_wood_eff2].isFertile = !0),
                                (message_on_click_m_eff2 = "4块木头合成了一座房子！"),
                                tempSelectedWoods_m_wood_eff2.forEach((id_to_remove_wood_item_m_eff2) => {
                                  gridCopy_on_click_m_eff2[Math.floor(id_to_remove_wood_item_m_eff2 / 4)][id_to_remove_wood_item_m_eff2 % 4].content = null;
                                });
                                housePlaced_flag_m_wood_eff2 = !0; break;
                              }
                            if (housePlaced_flag_m_wood_eff2) break;
                          }
                          housePlaced_flag_m_wood_eff2 || (message_on_click_m_eff2 = "没有空地建造房子！"), u_setSelectedWoods([]);
                        }
                      }
                    } else
                      "plant-dead" === clickedCell_on_click_m_eff2.content
                        ? ((clickedCell_on_click_m_eff2.content = "fire"), (clickedCell_on_click_m_eff2.fireEndTime = Date.now() + 30000), (message_on_click_m_eff2 = h_handleFireEffect(gridCopy_on_click_m_eff2, (message_on_click_m_eff2 = "枯叶被点燃，变成了火！"))))
                        : (message_on_click_m_eff2 = "请先选择一个物品，或点击植物/枯叶进行转化。");
    
                    // **老虎全局吃人逻辑 (要求5)**
                    let currentTigerCount_click_eff = 0;
                    gridCopy_on_click_m_eff.flat().forEach(cell => { if (cell.content === 'tiger') currentTigerCount_click_eff++; });
    
                    if (currentTigerCount_click_eff > 0) {
                        let humansEatenThisTurn_click_eff = false;
                        for (let r_tg_eat_eff_click = 0; r_tg_eat_eff_click < 5; r_tg_eat_eff_click++) {
                            for (let c_tg_eat_eff_click = 0; c_tg_eat_eff_click < 4; c_tg_eat_eff_click++) {
                                if (gridCopy_on_click_m_eff[r_tg_eat_eff_click][c_tg_eat_eff_click].content === "human" && gridCopy_on_click_m_eff[r_tg_eat_eff_click][c_tg_eat_eff_click].owner !== "human") {
                                    gridCopy_on_click_m_eff[r_tg_eat_eff_click][c_tg_eat_eff_click].content = "human-dead";
                                    gridCopy_on_click_m_eff[r_tg_eat_eff_click][c_tg_eat_eff_click].isDecaying = true;
                                    gridCopy_on_click_m_eff[r_tg_eat_eff_click][c_tg_eat_eff_click].decayEndTime = Date.now() + 1000;
                                    if (!humansEatenThisTurn_click_eff) {
                                       f_addMessage("老虎出没，吃掉了位于(".concat(r_tg_eat_eff_click + 1, ",").concat(c_tg_eat_eff_click + 1, ")的不在房子里的人！"));
                                       humansEatenThisTurn_click_eff = true;
                                    }
                                }
                            }
                        }
                    }
    
                    message_on_click_m_eff && f_addMessage(message_on_click_m_eff);
                    g_updateGameState(gridCopy_on_click_m_eff);
                  },
                  p_selectItem = (itemName_select_p_eff2) => {
                    a_setSelectedItem(itemName_select_p_eff2);
                    u_setSelectedWoods([]);
                    f_addMessage("选择了 ".concat("plant" === itemName_select_p_eff2 ? "植物" : "human" === itemName_select_p_eff2 ? "人" : "老虎"));
                  },
                  y_getCellIcon = (cell_icon_y_eff2) =>
                    "plant" === cell_icon_y_eff2.content ? "\uD83C\uDF3F"
                    : "plant-dead" === cell_icon_y_eff2.content ? "\uD83C\uDF42"
                    : "human" === cell_icon_y_eff2.content ? "\uD83E\uDDD1"
                    : "human-dead" === cell_icon_y_eff2.content ? "\uD83D\uDC80"
                    : "tiger" === cell_icon_y_eff2.content ? "\uD83D\uDC05"
                    : "tiger-dead" === cell_icon_y_eff2.content ? "☠️"
                    : "fire" === cell_icon_y_eff2.content ? "\uD83D\uDD25"
                    : "wood" === cell_icon_y_eff2.content ? (d_selectedWoods.includes(cell_icon_y_eff2.id) ? "\uD83E\uDEB5✨" : "\uD83E\uDEB5")
                    : "house" === cell_icon_y_eff2.content ? ("human" === cell_icon_y_eff2.owner ? "\uD83C\uDFE0\uD83E\uDDD1" : "\uD83C\uDFE0")
                    : "ash" === cell_icon_y_eff2.content ? "\uD83E\uDEA8" : "",
                  b_getCellStyle = (cell_style_b_eff2) => {
                    let bgColor_cell_b_eff2 = "#D2B48C";
                    return (
                      "fire" === cell_style_b_eff2.content ? (bgColor_cell_b_eff2 = "#ffcc80")
                      : "ash" === cell_style_b_eff2.content ? (bgColor_cell_b_eff2 = "#A9A9A9")
                      : cell_style_b_eff2.isFertile || (bgColor_cell_b_eff2 = "#E0C9A6"),
                      {
                        border: "1px solid #a5d6a7", backgroundColor: bgColor_cell_b_eff2, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "2.5em",
                        cursor: "pointer", transition: "background-color 0.3s ease, transform 0.1s ease",
                        borderRadius: "4px", boxShadow: d_selectedWoods.includes(cell_style_b_eff2.id) ? "0 0 5px 2px yellow" : "none",
                      }
                    );
                  },
                  V_buttonStyle = { padding: "10px 15px", fontSize: "1em", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", margin: "5px" },
                  C_textStyle = { margin: "5px 0", fontSize: "0.9em", color: "black" },
                  W_headerStyle = { color: "black", marginTop: "15px", flexShrink: 0 },
                  L_timerStyle = { textAlign: "center", color: t_gameState.timeLeft < 10 ? "red" : t_gameState.timeLeft < 60 ? "#f57c00" : "black", marginTop: "0", marginBottom: "10px", flexShrink: 0 };
    
                    const selectableItems_render_final = [
                        { name: "plant", label: "植物 \uD83C\uDF3F" },
                        { name: "human", label: "人 \uD83E\uDDD1" },
                    ];
                    if (t_gameState.currentLevel > 1) {
                        selectableItems_render_final.push({ name: "tiger", label: "老虎 \uD83D\uDC05" });
                    }
    
                return (0, o_jsxRuntime.jsx)("div", {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", width: "100vw", padding: "0px", margin: "0px", boxSizing: "border-box", backgroundColor: "#001f3f" },
                  children: (0, o_jsxRuntime.jsxs)("div", {
                    style: { position:"relative", display: "flex", flexDirection: "row", backgroundColor: "#e0f2f1", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "100%", height: "100%", maxWidth: "1200px", maxHeight: "95vh", boxSizing: "border-box", overflow: "hidden" },
                    children: [
                      t_gameState.isRaining && (0, o_jsxRuntime.jsx)("div", {
                        style: {
                            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                            backgroundColor: "rgba(100,100,150,0.3)",
                            zIndex: 1000, pointerEvents: "none", display: "flex",
                            justifyContent: "center", alignItems: "flex-start", overflow: "hidden"
                        },
                        children: Array.from({ length: 50 }).map((_, idx) => (0, o_jsxRuntime.jsx)("div", {
                            style: {
                                position: "absolute", left: "".concat(Math.random() * 100, "%"),
                                width: "2px", height: "".concat(10 + Math.random() * 10, "px"),
                                backgroundColor: "rgba(173, 216, 230, 0.7)",
                                animation: "fall ".concat(0.5 + Math.random() * 0.5, "s linear infinite"),
                                animationDelay: "".concat(Math.random() * 3, "s")
                            }
                        }, "rain-".concat(idx)))
                      }),
                      (0, o_jsxRuntime.jsx)("style", {
                        children: ` @keyframes fall { to { transform: translateY(95vh); opacity: 0; } } `
                      }),
                      (0, o_jsxRuntime.jsxs)("div", {
                        style: { flexGrow: 1, marginRight: "20px", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "10px" },
                        children: [
                          (0, o_jsxRuntime.jsx)("h1", { style: { textAlign: "center", fontSize: "1.5em", color: "#2e7d32", marginBottom: "5px", flexShrink: 0 }, children: "创设氧气浓度适宜生物多样化的环境" }),
                          (0, o_jsxRuntime.jsxs)("h2", { style: { textAlign: "center", fontSize: "1.2em", color: "#4caf50", marginTop: "0", marginBottom: "10px", flexShrink: 0 }, children: ["当前关卡：", t_gameState.currentLevel] }),
                          3 === t_gameState.currentLevel && !t_gameState.isGameOver && (0, o_jsxRuntime.jsxs)("h3", { style: timerStyle_render_final, children: ["倒计时: ", t_gameState.timeLeft, "s"] }),
                          (0, o_jsxRuntime.jsx)("div", {
                            style: { display: "grid", gridTemplateColumns: "repeat(".concat(4, ", 80px)"), gridTemplateRows: "repeat(".concat(5, ", 80px)"), gap: "5px", border: "2px solid #a5d6a7", margin: "20px auto", backgroundColor: "#c8e6c9", borderRadius: "8px", padding: "5px" },
                            children: t_gameState.grid.flat().map((cell_data_final_map_render_val_jsx) =>
                              (0, o_jsxRuntime.jsx)("div", {
                                onClick: () => m_handleCellClick(Math.floor(cell_data_final_map_render_val_jsx.id / 4), cell_data_final_map_render_val_jsx.id % 4),
                                style: b_getCellStyle(cell_data_final_map_render_val_jsx),
                                title: cell_data_final_map_render_val_jsx.content || (cell_data_final_map_render_val_jsx.isFertile ? ("ash" === cell_data_final_map_render_val_jsx.content ? "草木灰土地" : "空地") : "贫瘠土地"),
                                onMouseEnter: (e_hover_final_render_val_jsx) => (e_hover_final_render_val_jsx.currentTarget.style.transform = "scale(1.05)"),
                                onMouseLeave: (e_hover_final_render_val_jsx) => (e_hover_final_render_val_jsx.currentTarget.style.transform = "scale(1)"),
                                children: y_getCellIcon(cell_data_final_map_render_val_jsx),
                              }, cell_data_final_map_render_val_jsx.id)
                            ),
                          }),
                          (0, o_jsxRuntime.jsxs)("div", {
                            style: { textAlign: "center", marginTop: "20px", flexShrink: 0 },
                            children: [
                              (0, o_jsxRuntime.jsx)("button", { onClick: () => { c_history.length > 0 && (n_setGameState(c_history[c_history.length - 1]), s_setHistory(c_history.slice(0, -1)), u_setSelectedWoods([]), f_addMessage("操作已撤销")); }, style: buttonStyle_render_final, children: "撤销" }),
                              (0, o_jsxRuntime.jsx)("button", {
                                onClick: () => {
                                  x_saveHistory(); 
                                    let nextLevel_final_render_val_btn = t_gameState.currentLevel < 3 ? t_gameState.currentLevel + 1 : (t_gameState.isGameOver && t_gameState.timeLeft === 0 ? 3 : 1); // 结束或重玩时回到第一关或第三关
                                    if (t_gameState.currentLevel === 3 && t_gameState.isGameOver && t_gameState.timeLeft === 0) {
                                        f_addMessage("重新开始第三关");
                                        nextLevel_final_render_val_btn = 3;
                                    } else if (t_gameState.currentLevel === 3 && !(t_gameState.isGameOver && t_gameState.timeLeft === 0)) { // 在第三关中，按钮是“重新开始当前关卡”
                                        f_addMessage("重新开始当前关卡");
                                         nextLevel_final_render_val_btn = 3;
                                    }
                                     else {
                                        f_addMessage("进入关卡 ".concat(nextLevel_final_render_val_btn));
                                    }
                                  n_setGameState((gs_nextLevel_final_render_val_btn) => ({ ...gs_nextLevel_final_render_val_btn, currentLevel: nextLevel_final_render_val_btn, grid: e_initializeGrid(), oxygenLevel: 0, plantCount: 0, humanCount: 0, tigerCount: 0, woodCount: 0, timeLeft: 120, isGameOver: false, messages: ["欢迎来到关卡 ".concat(nextLevel_final_render_val_btn)], plantsConsumedByHumanPairs: 0 }));
                                  u_setSelectedWoods([]), g_updateGameState(e_initializeGrid());
                                },
                                style: { ...buttonStyle_render_final, marginLeft: "10px" },
                                children: (t_gameState.currentLevel === 3 && t_gameState.isGameOver && t_gameState.timeLeft === 0) ? "重新开始第三关" : (3 === t_gameState.currentLevel ? "重新开始当前关卡" : "进入下一关"),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, o_jsxRuntime.jsxs)("div", {
                        style: { width: "300px", paddingLeft: "20px", borderLeft: "1px solid #bcaaa4", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0, padding: "10px" },
                        children: [
                          (0, o_jsxRuntime.jsx)("h3", { style: headerStyle_render_final, children: "可选生物/物品:" }),
                          (0, o_jsxRuntime.jsx)("div", {
                            style: { marginBottom: "15px", flexShrink: 0 },
                            children: selectableItems_render.map((item_data_final_map_render_val_jsx_sel) =>
                              (0, o_jsxRuntime.jsx)("button", {
                                onClick: () => p_selectItem(item_data_final_map_render_val_jsx_sel.name),
                                style: { padding: "10px", margin: "5px 0", width: "100%", fontSize: "1em", cursor: "pointer", backgroundColor: r_selectedItem === item_data_final_map_render_val_jsx_sel.name ? "#a5d6a7" : "#fff", border: "1px solid #a5d6a7", borderRadius: "5px", color: "#333", textAlign: "left" },
                                children: item_data_final_map_render_val_jsx_sel.label,
                              }, item_data_final_map_render_val_jsx_sel.name)
                            ),
                          }),
                          (0, o_jsxRuntime.jsx)("h3", { style: headerStyle_render_final, children: "状态显示:" }),
                          (0, o_jsxRuntime.jsxs)("div", {
                            style: { marginBottom: "10px", flexShrink: 0 },
                            children: [
                              (0, o_jsxRuntime.jsxs)("p", { style: textStyle_render_final, children: ["氧气浓度: ", t_gameState.oxygenLevel, "%"] }),
                              (0, o_jsxRuntime.jsx)("div", {
                                style: { width: "100%", backgroundColor: "#ddd", borderRadius: "3px", height: "20px", overflow: "hidden" },
                                children: (0, o_jsxRuntime.jsx)("div", { style: { width: "".concat(t_gameState.oxygenLevel, "%"), backgroundColor: t_gameState.oxygenLevel < 20 || t_gameState.oxygenLevel > 30 ? "#f44336" : "#4caf50", height: "100%", borderRadius: "3px", transition: "width 0.5s ease-in-out" } }),
                              }),
                            ],
                          }),
                          (0, o_jsxRuntime.jsxs)("p", { style: textStyle_render_final, children: ["植物数量: ", t_gameState.plantCount, " \uD83C\uDF3F"] }),
                          (0, o_jsxRuntime.jsxs)("p", { style: textStyle_render_final, children: ["人类数量: ", t_gameState.humanCount, " \uD83E\uDDD1"] }),
                          (0, o_jsxRuntime.jsxs)("p", { style: textStyle_render_final, children: ["老虎数量: ", t_gameState.tigerCount, " \uD83D\uDC05"] }),
                          (0, o_jsxRuntime.jsxs)("p", { style: textStyle_render_final, children: ["木头数量: ", t_gameState.woodCount, " \uD83E\uDEB5"] }),
                          (0, o_jsxRuntime.jsx)("h3", { style: headerStyle_render_final, children: "信息提示:" }),
                          (0, o_jsxRuntime.jsx)("textarea", { readOnly: !0, value: t_gameState.messages.join("\n"), style: { width: "100%", minHeight: "100px", flexGrow: 1, border: "1px solid #a5d6a7", borderRadius: "5px", padding: "10px", fontSize: "0.9em", backgroundColor: "#f1f8e9", boxSizing: "border-box", resize: "none", color: "black" } }),
                        ],
                      }),
                    ],
                  }),
                });
              };
          },
        },
        (e_wp) => { // 修改 e -> e_wp
          var t_wp_cb = (t_param) => e_wp((e_wp.s = t_param)); // 修改 t -> t_wp_cb, t -> t_param
          e_wp.O(0, [685, 411, 358], () => t_wp_cb(3662)), (_N_E = e_wp.O());
        },
      ]);