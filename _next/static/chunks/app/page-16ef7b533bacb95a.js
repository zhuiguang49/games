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
            // 检查老虎威胁的函数
            for (let [o, l] of [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ]) {
              let i = e + o,
                r = t + l;
              if (
                i >= 0 &&
                i < 5 &&
                r >= 0 &&
                r < 4 &&
                "tiger" === n[i][r].content
              )
                return !0;
            }
            return !1;
          },
          // page-16ef7b533bacb95a.js
        r = () => {
            // 游戏主组件
            const initialGrid = () =>
            [, , , , ,].fill(null).map((_, r_idx) =>
                [, , , ,].fill(null).map((_, c_idx) => ({
                id: 4 * r_idx + c_idx,
                content: null,
                isFertile: !0,
                owner: null,
                isDecaying: !1,
                })),
            );
        
            const [t, n] = (0, l.useState)({
            grid: initialGrid(),
            oxygenLevel: 0,
            plantCount: 0,
            humanCount: 0, // 用于UI显示在格子外的人数
            tigerCount: 0,
            woodCount: 0,
            currentLevel: 1,
            timeLeft: 120,
            messages: ["欢迎来到生态保护游戏！"],
            isGameOver: !1,
            });
        
            const [r_selectedItem, setSelectedItem] = (0, l.useState)(null);
            const [c_history, setHistory] = (0, l.useState)([]);
            const [d_selectedWoods, setSelectedWoods] = (0, l.useState)([]);
        
            const f_addMessage = (0, l.useCallback)((messageText) => {
            n((currentGameState) => ({
                ...currentGameState,
                messages: [...currentGameState.messages.slice(-5), messageText],
            }));
            }, []);
        
            const h_handleFireEffect = (0, l.useCallback)(
            (currentGrid, messageLog) => {
                let newMessageLog = messageLog;
                if (
                currentGrid.flat().filter((cell) => "fire" === cell.content)
                    .length >= 2
                ) {
                for (let r_idx = 0; r_idx < 5; r_idx++) {
                    for (let c_idx = 0; c_idx < 4; c_idx++) {
                    if ("tiger" === currentGrid[r_idx][c_idx].content) {
                        let fireSources = 0;
                        for (let [dr, dc] of [
                        [-1, 0], [1, 0], [0, -1], [0, 1],
                        ]) {
                        let adj_r = r_idx + dr,
                            adj_c = c_idx + dc;
                        if (
                            adj_r >= 0 &&
                            adj_r < 5 &&
                            adj_c >= 0 &&
                            adj_c < 4 &&
                            "fire" === currentGrid[adj_r][adj_c].content
                        ) {
                            fireSources++;
                        }
                        }
                        if (fireSources >= 2) {
                        currentGrid[r_idx][c_idx].content = "tiger-dead";
                        currentGrid[r_idx][c_idx].isDecaying = !0;
                        newMessageLog += " 两团火的热量消灭了一只老虎！";
                        return newMessageLog;
                        }
                    }
                    }
                }
                }
                return newMessageLog;
            },
            [],
            );
        
            // g_updateGameState 现在只负责更新状态，氧气值由 m_handleCellClick 计算好传入
            const g_updateGameState = (0, l.useCallback)(
                (currentGrid_g, finalOxygenLevelForThisTurn) => {
                let plant_count_g = 0;
                let human_count_display = 0; // UI显示的人数 (格子内容为 'human')
                let tiger_count_g = 0;
                let wood_count_g = 0;
                // activeHumanCount_forOxygen 的计算和耗氧逻辑移到 m_handleCellClick
            
                currentGrid_g.flat().forEach((cell_g) => {
                    if ("plant" === cell_g.content) plant_count_g++;
                    if ("human" === cell_g.content) human_count_display++;
                    if ("tiger" === cell_g.content) tiger_count_g++;
                    if ("wood" === cell_g.content) wood_count_g++;
                });
            
                n((current_gs) => ({
                    ...current_gs,
                    plantCount: plant_count_g,
                    humanCount: human_count_display,
                    tigerCount: tiger_count_g,
                    woodCount: wood_count_g,
                    oxygenLevel: Math.max(0, Math.min(100, finalOxygenLevelForThisTurn)), // 直接使用传入的氧气值
                    grid: currentGrid_g,
                }));
                },
                [], // 移除了 t.currentLevel 的依赖，因为它不再直接计算氧气
            );

            const calculateOxygenFromGrid = (grid_to_calc) => {
                let oxygen = 0;
                let activeHumans = 0;
                grid_to_calc.flat().forEach(cell => {
                    if (cell.content === 'plant') {
                        oxygen += (t.currentLevel === 3 && !cell.isFertile) ? 1 : 10;
                    }
                    if (cell.content === 'human' || cell.owner === 'human') {
                        activeHumans++;
                    }
                });
                oxygen -= 5 * activeHumans;
                return Math.max(0, Math.min(100, oxygen));
            };
        
            (0, l.useEffect)(() => {
            let e_gridCopy = t.grid.map((row) =>
                row.map((cell) => ({ ...cell })),
                ),
                messages_arr = [],
                changed_flag_for_death = !1; // 重命名以区分
        
            let oxygenLevelForDeathCheck = t.oxygenLevel; // 使用当前状态的氧气值进行死亡判断
        
            e_gridCopy.forEach((row, r_eff) => {
                row.forEach((cell_in_effect, a_eff) => {
                    if ( (cell_in_effect.content === "human" && cell_in_effect.owner !== "human") ||
                        (cell_in_effect.owner === "human" && cell_in_effect.content === "house")
                        ) {
                        if (oxygenLevelForDeathCheck < 20) {
                        messages_arr.push( (cell_in_effect.owner === "human" ? "房子里的" : "") + "人类因氧气浓度低于20%窒息而亡！");
                        e_gridCopy[r_eff][a_eff].content = "human-dead";
                        e_gridCopy[r_eff][a_eff].owner = null;
                        e_gridCopy[r_eff][a_eff].isDecaying = !0;
                        changed_flag_for_death = !0;
                        } else if (oxygenLevelForDeathCheck > 30) {
                        messages_arr.push( (cell_in_effect.owner === "human" ? "房子里的" : "") + "人类因氧气浓度高于30%死亡！");
                        e_gridCopy[r_eff][a_eff].content = "human-dead";
                        e_gridCopy[r_eff][a_eff].owner = null;
                        e_gridCopy[r_eff][a_eff].isDecaying = !0;
                        changed_flag_for_death = !0;
                        }
                    }
                });
            });
        
        
            e_gridCopy.forEach((row, r_eff) => {
                row.forEach((cell_in_effect, a_eff) => {
                    if (
                        ("human-dead" === cell_in_effect.content || "tiger-dead" === cell_in_effect.content) &&
                        cell_in_effect.isDecaying
                    ) {
                        setTimeout(() => {
                            n(prevGameState => {
                                const newGridForDecay = prevGameState.grid.map(r => r.map(c => ({...c})));
                                if (newGridForDecay[r_eff][a_eff].id === cell_in_effect.id && newGridForDecay[r_eff][a_eff].isDecaying) {
                                    newGridForDecay[r_eff][a_eff].content = null;
                                    newGridForDecay[r_eff][a_eff].isDecaying = !1;
                                    const decayedObjectName = "human-dead" === cell_in_effect.content ? "骸骨" : "老虎残骸";
                                    f_addMessage(`一具${decayedObjectName}风化消失了。`);
                                    // 重要的：腐烂后，需要重新计算氧气，因为地图上实体可能变化影响计数，但不直接调整氧气
                                    // 而是让 g_updateGameState 根据新 grid 重新计算（如果需要）
                                    // 但由于 g_updateGameState 现在依赖外部传入氧气，这里我们只更新 grid
                                    // 并在 m_handleCellClick 或其他主动操作中触发氧气重算
                                    // 一个简单的做法是，如果腐烂导致格子内容变化，就调用 g_updateGameState 传入当前的氧气值（因为腐烂不直接影响氧气）
                                    g_updateGameState(newGridForDecay, prevGameState.oxygenLevel);
                                    return {...prevGameState, grid: newGridForDecay};
                                }
                                return prevGameState;
                            });
                        }, 1000);
                    }
                });
            });
        
        
            if (messages_arr.length > 0) {
                messages_arr.forEach((msg) => f_addMessage(msg));
            }
            if (changed_flag_for_death) {
                // 如果因为氧气导致死亡，grid 已经改变，需要用新的 grid 和当前的 oxygenLevel (在死亡判断前的值) 去更新状态
                // 或者，更准确的是，让 g_updateGameState 根据 e_gridCopy 重新计算一次氧气（传入 null）
                g_updateGameState(e_gridCopy, t.oxygenLevel); // 使用死亡判断前的氧气值，但用更新了死亡状态的 grid
            }
            }, [
            t.oxygenLevel, // 依赖氧气水平
            t.grid,        // 依赖网格状态
            f_addMessage,
            g_updateGameState, // g_updateGameState 依赖于 n, 不直接依赖 t
            ]);
        
            (0, l.useEffect)(() => {
            let e_gridCopy_fire = t.grid.map((row) =>
                row.map((cell) => ({ ...cell })),
                ),
                fireExtinguished_flag = !1,
                currentTime = Date.now();
            let oxygenFromExtinguishedFires = 0; // 火熄灭后，如果之前是植物烧的，那块地相当于空了，产氧会变化
        
            e_gridCopy_fire.flat().forEach((cell_fire) => {
                if ("fire" === cell_fire.content &&
                cell_fire.fireEndTime &&
                currentTime >= cell_fire.fireEndTime) {
                // 记录这块地之前如果是植物，它贡献了多少氧气（这个逻辑比较复杂，因为不知道火之前是什么）
                // 简单处理：火熄灭变成灰烬，灰烬不产氧，也不耗氧。这个变化由 g_updateGameState 处理。
                cell_fire.content = "ash";
                cell_fire.isFertile = !0;
                cell_fire.fireEndTime = void 0;
                fireExtinguished_flag = !0;
                f_addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。");
                }
            });
            if (fireExtinguished_flag) {
                // 火熄灭，grid 变了，氧气需要重新计算
                g_updateGameState(e_gridCopy_fire, t.oxygenLevel); // 先用当前氧气更新，然后让下一轮计算精确值
                                                                // 或者直接传 null，让 g_updateGameState 自己算
                                                                // g_updateGameState(e_gridCopy_fire, null);
            }
            }, [t.grid, f_addMessage, g_updateGameState, t.oxygenLevel]);
        
            (0, l.useEffect)(() => {
            let interval_id;
            if (3 === t.currentLevel && t.timeLeft > 0 && !t.isGameOver)
                interval_id = setInterval(() => {
                n((gs_flood) => ({
                    ...gs_flood,
                    timeLeft: gs_flood.timeLeft - 1,
                }));
                }, 1e3);
            else if (
                3 === t.currentLevel &&
                0 === t.timeLeft &&
                !t.isGameOver
            ) {
                f_addMessage("120秒到！持续强降雨，引发大洪水！");
                let finalOxygenAfterFlood = 0; // 洪水后氧气需要重新计算
                let newGrid_flood = t.grid.map(
                (
                    row_flood,
                ) =>
                    row_flood.map((cell_flood) => {
                    let tempCell_flood = { ...cell_flood };
                    if ("fire" === tempCell_flood.content) {
                        tempCell_flood.content = "ash";
                        tempCell_flood.isFertile = !0;
                        tempCell_flood.fireEndTime = void 0;
                    } else if ("ash" !== tempCell_flood.content) {
                        tempCell_flood.content = null;
                        tempCell_flood.owner = null;
                        tempCell_flood.isFertile = !1; // 其他土地变贫瘠
                    }
                    tempCell_flood.isDecaying = !1;
                    return tempCell_flood;
                    }),
                );
                // 重新计算洪水后的氧气
                newGrid_flood.flat().forEach(cell => {
                    if (cell.content === 'plant') {
                        finalOxygenAfterFlood += cell.isFertile ? 10 : 1; // 贫瘠土地植物产1氧
                    }
                });
                let activeHumansAfterFlood = 0;
                newGrid_flood.flat().forEach(cell => {
                    if (cell.content === 'human' || cell.owner === 'human') activeHumansAfterFlood++;
                });
                finalOxygenAfterFlood -= 5 * activeHumansAfterFlood;
        
        
                g_updateGameState(newGrid_flood, finalOxygenAfterFlood);
                n((gs_flood_update) => ({
                ...gs_flood_update,
                messages: [
                    ...gs_flood_update.messages.slice(-5),
                    "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。",
                ],
                woodCount: 0,
                }));
            }
            return () => clearInterval(interval_id);
            }, [
            t.currentLevel,
            t.timeLeft,
            t.isGameOver,
            f_addMessage,
            g_updateGameState,
            t.grid,
            ]);
        
            const x_saveHistory = () => {
            setHistory((prevHistory) => [
                ...prevHistory,
                JSON.parse(JSON.stringify(t)),
            ]);
            };
        
            // --- 函数定义方式修正 ---
            const p_selectItem = (itemName) => {
            setSelectedItem(itemName);
            setSelectedWoods([]);
            f_addMessage(
                "选择了 ".concat(
                "plant" === itemName
                    ? "植物"
                    : "human" === itemName
                    ? "人"
                    : "老虎",
                ),
            );
            };
        
            const x_saveHistory = () => { /* ... */ };
  const p_selectItem = (itemName) => { /* ... */ };

  const m_handleCellClick = (row_idx, col_idx) => {
    x_saveHistory();

    let gridCopy_click = t.grid.map((row) =>
      row.map((cell) => ({ ...cell })),
    );
    let clickedCell = gridCopy_click[row_idx][col_idx];
    let message_click = "";
    let shouldUpdateGridAndOxygen = true;
    let newOxygenLevel = t.oxygenLevel; // 以当前氧气为基础进行增减

    if (r_selectedItem) {
      if (
        null === clickedCell.content ||
        ("ash" === clickedCell.content && "plant" === r_selectedItem)
      ) {
        if ("plant" === r_selectedItem) {
          if (clickedCell.isFertile || "ash" === clickedCell.content) {
            clickedCell.content = "plant";
            clickedCell.isFertile = !0; // 种在灰烬上也视为肥沃
            message_click = "放置了 植物";
            // 直接增加氧气
            newOxygenLevel += (t.currentLevel === 3 && !clickedCell.isFertile /*其实灰烬地是肥沃的*/) ? 1 : 10;
          } else {
            message_click = "土地贫瘠，植物无法生长！请先用火制造草木灰恢复地力。";
            shouldUpdateGridAndOxygen = false;
          }
          setSelectedItem(null);
        } else if ("human" === r_selectedItem) {
          gridCopy_click[row_idx][col_idx].content = "human";
          message_click = "放置了 人";
          newOxygenLevel -= 5; // 放置一个人，氧气-5

          if (i(row_idx, col_idx, gridCopy_click)) { // i 是老虎威胁检查函数
            message_click += ", 附近有老虎威胁。";
          } else {
            message_click += "。";
          }

          let currentTotalHumanCountAfterPlacement = 0;
          gridCopy_click.flat().forEach(cell => {
            if (cell.content === "human" || cell.owner === "human") {
              currentTotalHumanCountAfterPlacement++;
            }
          });

          if (currentTotalHumanCountAfterPlacement > 0 && currentTotalHumanCountAfterPlacement % 2 === 0) {
            let existingPlants_human = [];
            gridCopy_click.forEach((row, r_idx_plant) => {
              row.forEach((cell, c_idx_plant) => {
                if (cell.content === "plant") {
                  existingPlants_human.push({ r: r_idx_plant, c: c_idx_plant });
                }
              });
            });

            if (existingPlants_human.length > 0) {
              let plantToRemove_idx = Math.floor(Math.random() * existingPlants_human.length);
              let plantCellToRemoveData = existingPlants_human[plantToRemove_idx];
              gridCopy_click[plantCellToRemoveData.r][plantCellToRemoveData.c].content = null;
              gridCopy_click[plantCellToRemoveData.r][plantCellToRemoveData.c].owner = null;
              message_click += " 由于人类增多，消耗了一株植物。";
              // 关键：这一步植物消失，不直接影响本轮已计算的 newOxygenLevel
            } else {
              message_click += " 人类增多，但没有植物可消耗。";
            }
          }
          setSelectedItem(null);
        } else if ("tiger" === r_selectedItem) {
          gridCopy_click[row_idx][col_idx].content = "tiger";
          message_click = "放置了 老虎";
          setSelectedItem(null);
          // 老虎放置不直接影响氧气
        }
      } else if (
        "human" === r_selectedItem &&
        "house" === clickedCell.content &&
        null === clickedCell.owner
      ) {
        gridCopy_click[row_idx][col_idx].owner = "human";
        message_click = "人住进了房子！";
        newOxygenLevel -= 5; // 人住进房子，也耗氧-5

        let currentTotalHumanCountAfterHouseMove = 0;
        gridCopy_click.flat().forEach(cell => {
          if (cell.content === "human" || cell.owner === "human") {
            currentTotalHumanCountAfterHouseMove++;
          }
        });
        if (currentTotalHumanCountAfterHouseMove > 0 && currentTotalHumanCountAfterHouseMove % 2 === 0) {
          let existingPlants_human = [];
          gridCopy_click.forEach((row, r_idx_plant) => { /* ... */ }); // 省略重复代码
          if (existingPlants_human.length > 0) {
            /* ...移除植物... */
            message_click += " 由于人类增多，消耗了一株植物。";
          } else { /* ... */ }
        }
        setSelectedItem(null);
      } else {
        message_click = "这个格子已经被占用了或操作无效！";
        shouldUpdateGridAndOxygen = false;
      }
    } else if ("plant" === clickedCell.content) {
      const plantIsFertile = clickedCell.isFertile;
      const oxygenFromThisPlant = (t.currentLevel === 3 && !plantIsFertile) ? 1 : 10;

      if (i(row_idx, col_idx, gridCopy_click)) {
        gridCopy_click[row_idx][col_idx].content = "fire";
        gridCopy_click[row_idx][col_idx].fireEndTime = Date.now() + 3e4;
        message_click = h_handleFireEffect(gridCopy_click, "植物在老虎的威胁下被点燃了！");
        newOxygenLevel -= oxygenFromThisPlant; // 燃烧植物，氧气减少
      } else if (t.currentLevel >= 2) {
        gridCopy_click[row_idx][col_idx].content = "wood";
        message_click = "植物变成了木头！收集4块木头可以建造房子。";
        newOxygenLevel -= oxygenFromThisPlant; // 植物变木头，氧气减少
      } else {
        message_click = "点击植物。在第二关及以后，植物可以转化为木头。";
        shouldUpdateGridAndOxygen = false;
      }
    } else if ("wood" === clickedCell.content && t.currentLevel >= 2) {
      let woodId_click = clickedCell.id;
      if (!d_selectedWoods.includes(woodId_click)) {
        let tempSelectedWoods = [...d_selectedWoods, woodId_click];
        setSelectedWoods(tempSelectedWoods);
        message_click = "选择了木头 (".concat(tempSelectedWoods.length,"/4)。");
        if (4 === tempSelectedWoods.length) {
          // ... (合成房子逻辑)
          setSelectedWoods([]);
        }
      }
      // 合成房子不直接改变氧气，除非你规定消耗木头时氧气改变
    } else if ("plant-dead" === clickedCell.content) {
      gridCopy_click[row_idx][col_idx].content = "fire";
      gridCopy_click[row_idx][col_idx].fireEndTime = Date.now() + 3e4;
      message_click = h_handleFireEffect(gridCopy_click, "枯叶被点燃，变成了火！");
      // 枯叶点燃不产氧也不耗氧（因为它之前就不产氧）
    } else {
      message_click = "请先选择一个物品，或点击植物/枯叶进行转化。";
      shouldUpdateGridAndOxygen = false;
    }

    if (message_click) {
        f_addMessage(message_click);
    }

    if (shouldUpdateGridAndOxygen) {
      let tigerEats_flag = false;
      let finalGrid = gridCopy_click.map(r_tg => r_tg.map(c_tg => ({...c_tg}))); // 创建副本给老虎逻辑
      let oxygenAfterTigerAction = newOxygenLevel; // 以当前计算的氧气为基础

      if (t.currentLevel >= 2) {
        for (let r_tg_row = 0; r_tg_row < 5; r_tg_row++) {
          for (let c_tg_col = 0; c_tg_col < 4; c_tg_col++) {
            if ("tiger" === finalGrid[r_tg_row][c_tg_col].content) {
              let humanEaten_flag_inner = !1;
              for (let [dr_tg, dc_tg] of [[-1, 0],[1, 0],[0, -1],[0, 1],[-1, -1],[-1, 1],[1, -1],[1, 1]]) {
                let h_row = r_tg_row + dr_tg, h_col = c_tg_col + dc_tg;
                if (h_row >= 0 && h_row < 5 && h_col >= 0 && h_col < 4) {
                  let targetCell_tg = finalGrid[h_row][h_col];
                  if ("human" === targetCell_tg.content && targetCell_tg.owner !== "human") {
                    finalGrid[h_row][h_col].content = "human-dead";
                    finalGrid[h_row][h_col].isDecaying = !0;
                    f_addMessage( "老虎在(" + (r_tg_row + 1) + "," + (c_tg_col + 1) + ")吃掉了(" + (h_row + 1) + "," + (h_col + 1) + ")的人！");
                    tigerEats_flag = true;
                    humanEaten_flag_inner = true;
                    // 被吃掉的人不再耗氧，所以将之前减去的5点氧气加回来
                    oxygenAfterTigerAction += 5;
                    break;
                  }
                }
              }
              if (humanEaten_flag_inner) break;
            }
          }
          if (tigerEats_flag) break;
        }
      }
      g_updateGameState(finalGrid, oxygenAfterTigerAction); // 传递最终计算的氧气
    }
  };
        
            const y_getCellIcon = (cell) =>
            "plant" === cell.content
                ? "\uD83C\uDF3F"
                : "plant-dead" === cell.content
                ? "\uD83C\uDF42"
                : "human" === cell.content
                    ? "\uD83E\uDDD1"
                    : "human-dead" === cell.content
                    ? "\uD83D\uDC80"
                    : "tiger" === cell.content
                        ? "\uD83D\uDC05"
                        : "tiger-dead" === cell.content
                        ? "☠️"
                        : "fire" === cell.content
                            ? "\uD83D\uDD25"
                            : "wood" === cell.content
                            ? d_selectedWoods.includes(cell.id)
                                ? "\uD83E\uDEB5✨"
                                : "\uD83E\uDEB5"
                            : "house" === cell.content
                                ? "human" === cell.owner
                                ? "\uD83C\uDFE0\uD83E\uDDD1"
                                : "\uD83C\uDFE0"
                                : "ash" === cell.content
                                ? "\uD83E\uDEA8"
                                : "";
        
            const b_getCellStyle = (cell_style) => {
            let bgColor_cell = "#D2B48C";
            if ("fire" === cell_style.content) {
                bgColor_cell = "#ffcc80";
            } else if ("ash" === cell_style.content) {
                bgColor_cell = "#A9A9A9";
            } else if (!cell_style.isFertile) {
                bgColor_cell = "#E0C9A6";
            }
            return {
                border: "1px solid #a5d6a7",
                backgroundColor: bgColor_cell,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5em",
                cursor: "pointer",
                transition: "background-color 0.3s ease, transform 0.1s ease",
                borderRadius: "4px",
                boxShadow: d_selectedWoods.includes(cell_style.id)
                ? "0 0 5px 2px yellow"
                : "none",
            };
            };
        
            let buttonStyle_v = {
            padding: "10px 15px",
            fontSize: "1em",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            margin: "5px",
            };
            let textStyle_C = {
            margin: "5px 0",
            fontSize: "0.9em",
            color: "black",
            };
            let headerStyle_w = {
            color: "black",
            marginTop: "15px",
            flexShrink: 0,
            };
            let timerStyle_L = {
            textAlign: "center",
            color:
                t.timeLeft < 10 ? "red" : t.timeLeft < 60 ? "#f57c00" : "black",
            marginTop: "0",
            marginBottom: "10px",
            flexShrink: 0,
            };
            return (0, o.jsx)("div", {
            style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100vw",
                padding: "0px",
                margin: "0px",
                boxSizing: "border-box",
                backgroundColor: "#001f3f",
            },
            children: (0, o.jsxs)("div", {
                style: {
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#e0f2f1",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                width: "100%",
                height: "100%",
                maxWidth: "1200px",
                maxHeight: "95vh",
                boxSizing: "border-box",
                overflow: "hidden",
                },
                children: [
                (0, o.jsxs)("div", {
                    style: {
                    flexGrow: 1,
                    marginRight: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflowY: "auto",
                    padding: "10px",
                    },
                    children: [
                    (0, o.jsx)("h1", {
                        style: {
                        textAlign: "center",
                        fontSize: "1.5em",
                        color: "#2e7d32",
                        marginBottom: "5px",
                        flexShrink: 0,
                        },
                        children: "创设氧气浓度适宜生物多样化的环境",
                    }),
                    (0, o.jsxs)("h2", {
                        style: {
                        textAlign: "center",
                        fontSize: "1.2em",
                        color: "#4caf50",
                        marginTop: "0",
                        marginBottom: "10px",
                        flexShrink: 0,
                        },
                        children: ["当前关卡：", t.currentLevel],
                    }),
                    3 === t.currentLevel &&
                        (0, o.jsxs)("h3", {
                        style: timerStyle_L,
                        children: ["倒计时: ", t.timeLeft, "s"],
                        }),
                    (0, o.jsx)("div", {
                        style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(".concat(4, ", 80px)"),
                        gridTemplateRows: "repeat(".concat(5, ", 80px)"),
                        gap: "5px",
                        border: "2px solid #a5d6a7",
                        margin: "20px auto",
                        backgroundColor: "#c8e6c9",
                        borderRadius: "8px",
                        padding: "5px",
                        },
                        children: t.grid.flat().map(
                        (
                            cell_data_map,
                        ) =>
                            (0, o.jsx)(
                            "div",
                            {
                                onClick: () =>
                                m_handleCellClick(
                                    Math.floor(cell_data_map.id / 4),
                                    cell_data_map.id % 4,
                                ),
                                style: b_getCellStyle(cell_data_map),
                                title:
                                cell_data_map.content ||
                                (cell_data_map.isFertile
                                    ? "ash" === cell_data_map.content
                                    ? "草木灰土地"
                                    : "空地"
                                    : "贫瘠土地"),
                                onMouseEnter: (e_hover) =>
                                (e_hover.currentTarget.style.transform =
                                    "scale(1.05)"),
                                onMouseLeave: (e_hover) =>
                                (e_hover.currentTarget.style.transform =
                                    "scale(1)"),
                                children: y_getCellIcon(cell_data_map),
                            },
                            cell_data_map.id,
                            ),
                        ),
                    }),
                    (0, o.jsxs)("div", {
                        style: {
                        textAlign: "center",
                        marginTop: "20px",
                        flexShrink: 0,
                        },
                        children: [
                        (0, o.jsx)("button", {
                            onClick: () => {
                            if (c_history.length > 0) {
                                const previousState = c_history[c_history.length - 1];
                                n(previousState); // 直接恢复状态，包括氧气
                                setHistory(c_history.slice(0, -1));
                                setSelectedItem(null); // 清空选择
                                setSelectedWoods([]);   // 清空木头选择
                                f_addMessage("操作已撤销");
                            }
                            },
                            style: buttonStyle_v,
                            children: "撤销",
                        }),
                        (0, o.jsx)("button", {
                            onClick: () => {
                            x_saveHistory();
                            let nextLevel =
                                t.currentLevel < 3 ? t.currentLevel + 1 : 3;
                            f_addMessage(
                                3 === t.currentLevel
                                ? "重新开始关卡 ".concat(nextLevel)
                                : "进入关卡 ".concat(nextLevel),
                            );
                            const newGrid = initialGrid();
                            // 关卡切换时，氧气应该基于新关卡的初始状态（通常是0，或根据逻辑设定）
                            // g_updateGameState 会根据空grid计算出0氧（如果grid为空且没有其他生物）
                            // 或者我们直接设定初始氧气
                            g_updateGameState(newGrid, 0); // 重置grid并设定初始氧气为0
                            n((gs_nextLevel) => ({
                                ...gs_nextLevel,
                                currentLevel: nextLevel,
                            // grid: newGrid, // grid 已通过 g_updateGameState 更新
                            // oxygenLevel: 0, // oxygenLevel 已通过 g_updateGameState 更新
                                plantCount: 0,
                                humanCount: 0,
                                tigerCount: 0,
                                woodCount: 0,
                                timeLeft: 120,
                                isGameOver: !1,
                                messages: ["欢迎来到关卡 ".concat(nextLevel)],
                            }));
                            setSelectedItem(null);
                            setSelectedWoods([]);
                            },
                            style: { ...buttonStyle_v, marginLeft: "10px" },
                            children:
                            3 === t.currentLevel
                                ? "重新开始当前关卡"
                                : "进入下一关",
                        }),
                        ],
                    }),
                    ],
                }),
                (0, o.jsxs)("div", {
                    style: {
                    width: "300px",
                    paddingLeft: "20px",
                    borderLeft: "1px solid #bcaaa4",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    flexShrink: 0,
                    padding: "10px",
                    },
                    children: [
                    (0, o.jsx)("h3", {
                        style: headerStyle_w,
                        children: "可选生物/物品:",
                    }),
                    (0, o.jsx)("div", {
                        style: { marginBottom: "15px", flexShrink: 0 },
                        children: [
                        { name: "plant", label: "植物 🌿" },
                        { name: "human", label: "人 🧑" },
                        ...(t.currentLevel >= 2
                            ? [{ name: "tiger", label: "老虎 🐅" }]
                            : []),
                        ].map(
                        (
                            item_data_map,
                        ) =>
                            (0, o.jsx)(
                            "button",
                            {
                                onClick: () => p_selectItem(item_data_map.name),
                                style: {
                                padding: "10px",
                                margin: "5px 0",
                                width: "100%",
                                fontSize: "1em",
                                cursor: "pointer",
                                backgroundColor:
                                    r_selectedItem === item_data_map.name
                                    ? "#a5d6a7"
                                    : "#fff",
                                border: "1px solid #a5d6a7",
                                borderRadius: "5px",
                                color: "#333",
                                textAlign: "left",
                                },
                                children: item_data_map.label,
                            },
                            item_data_map.name,
                            ),
                        ),
                    }),
                    (0, o.jsx)("h3", {
                        style: headerStyle_w,
                        children: "状态显示:",
                    }),
                    (0, o.jsxs)("div", {
                        style: { marginBottom: "10px", flexShrink: 0 },
                        children: [
                        (0, o.jsxs)("p", {
                            style: textStyle_C,
                            children: ["氧气浓度: ", t.oxygenLevel, "%"],
                        }),
                        (0, o.jsx)("div", {
                            style: {
                            width: "100%",
                            backgroundColor: "#ddd",
                            borderRadius: "3px",
                            height: "20px",
                            overflow: "hidden",
                            },
                            children: (0, o.jsx)("div", {
                            style: {
                                width: "".concat(t.oxygenLevel, "%"),
                                backgroundColor:
                                t.oxygenLevel < 20 || t.oxygenLevel > 30
                                    ? "#f44336"
                                    : "#4caf50",
                                height: "100%",
                                borderRadius: "3px",
                                transition: "width 0.5s ease-in-out",
                            },
                            }),
                        }),
                        ],
                    }),
                    (0, o.jsxs)("p", {
                        style: textStyle_C,
                        children: ["植物数量: ", t.plantCount, " \uD83C\uDF3F"],
                    }),
                    (0, o.jsxs)("p", {
                        style: textStyle_C,
                        children: ["人类数量: ", t.humanCount, " \uD83E\uDDD1"],
                    }),
                    (0, o.jsxs)("p", {
                        style: textStyle_C,
                        children: ["老虎数量: ", t.tigerCount, " \uD83D\uDC05"],
                    }),
                    (0, o.jsxs)("p", {
                        style: textStyle_C,
                        children: ["木头数量: ", t.woodCount, " \uD83E\uDEB5"],
                    }),
                    (0, o.jsx)("h3", {
                        style: headerStyle_w,
                        children: "信息提示:",
                    }),
                    (0, o.jsx)("textarea", {
                        readOnly: !0,
                        value: t.messages.join("\n"),
                        style: {
                        width: "100%",
                        minHeight: "100px",
                        flexGrow: 1,
                        border: "1px solid #a5d6a7",
                        borderRadius: "5px",
                        padding: "10px",
                        fontSize: "0.9em",
                        backgroundColor: "#f1f8e9",
                        boxSizing: "border-box",
                        resize: "none",
                        color: "black",
                        },
                    }),
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
  