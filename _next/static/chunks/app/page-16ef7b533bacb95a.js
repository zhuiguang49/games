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
          r = () => {
            // 游戏主组件
            let e = () =>
                // 初始化 grid
                [, , , , ,].fill(null).map((e, t) =>
                  [, , , ,].fill(null).map((e, n) => ({
                    id: 4 * t + n,
                    content: null,
                    isFertile: !0, // 默认土地肥沃
                    owner: null,
                    isDecaying: !1,
                  })),
                ),
              [t, n] = (0, l.useState)({
                // 游戏状态
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
              [r_selectedItem, setSelectedItem] = (0, l.useState)(null),
              [c_history, setHistory] = (0, l.useState)([]),
              [d_selectedWoods, setSelectedWoods] = (0, l.useState)([]),
    
              f_addMessage = (0, l.useCallback)((messageText) => {
                n((currentGameState) => ({
                  ...currentGameState,
                  messages: [...currentGameState.messages.slice(-5), messageText],
                }));
              }, []),
    
              h_handleFireEffect = (0, l.useCallback)(
                (currentGrid, messageLog) => {
                  let newMessageLog = messageLog;
                  if (
                    currentGrid.flat().filter((cell) => "fire" === cell.content)
                      .length >= 2
                  ) {
                    for (
                      let r_idx = 0;
                      r_idx < 5;
                      r_idx++
                    )
                      for (
                        let c_idx = 0;
                        c_idx < 4;
                        c_idx++
                      )
                        if ("tiger" === currentGrid[r_idx][c_idx].content) {
                          let fireSources = 0;
                          for (let [dr, dc] of [
                            [-1, 0], [1, 0], [0, -1], [0, 1],
                          ]) {
                            let adj_r = r_idx + dr,
                              adj_c = c_idx + dc;
                            adj_r >= 0 &&
                              adj_r < 5 &&
                              adj_c >= 0 &&
                              adj_c < 4 &&
                              "fire" === currentGrid[adj_r][adj_c].content &&
                              fireSources++;
                          }
                          if (fireSources >= 2) {
                            currentGrid[r_idx][c_idx].content = "tiger-dead";
                            currentGrid[r_idx][c_idx].isDecaying = !0;
                            newMessageLog += " 两团火的热量消灭了一只老虎！";
                            return newMessageLog; // 一旦有老虎被消灭就返回
                          }
                        }
                  }
                  return newMessageLog;
                },
                [],
              ),
    
              g_updateGameState = (0, l.useCallback)(
                (currentGrid_g) => {
                  let plant_count_g = 0,
                    human_count_g = 0, // 这个 human_count_g 仅用于界面显示，实际耗氧和消耗植物基于 activeHumanCount
                    tiger_count_g = 0,
                    wood_count_g = 0,
                    oxygen_level_g = 0;
    
                  let activeHumanCount = 0; // 用于精确计算耗氧
    
                  currentGrid_g.flat().forEach((cell_g) => {
                    if ("plant" === cell_g.content) {
                      plant_count_g++;
                      if (t.currentLevel === 3 && !cell_g.isFertile) {
                        oxygen_level_g += 1;
                      } else {
                        oxygen_level_g += 10;
                      }
                    }
                    if (cell_g.content === "human") { // 只统计直接显示为人的
                      human_count_g++;
                    }
                    if (cell_g.content === "human" || cell_g.owner === "human") { // 统计所有活跃的人
                        activeHumanCount++;
                    }
                    if ("tiger" === cell_g.content) {
                      tiger_count_g++;
                    }
                    if ("wood" === cell_g.content) {
                      wood_count_g++;
                    }
                  });
    
                  oxygen_level_g -= 5 * activeHumanCount; // 每个活跃的人消耗5点氧气
    
                  oxygen_level_g = Math.max(0, Math.min(100, oxygen_level_g));
    
                  n((current_gs) => ({
                    ...current_gs,
                    plantCount: plant_count_g,
                    humanCount: human_count_g, // 界面上的人类数量
                    tigerCount: tiger_count_g,
                    woodCount: wood_count_g,
                    oxygenLevel: oxygen_level_g,
                    grid: currentGrid_g,
                  }));
                },
                [t.currentLevel], // 依赖 currentLevel 来正确计算植物产氧
              );
    
            (0, l.useEffect)(() => {
              let e_gridCopy = t.grid.map((row) =>
                  row.map((cell) => ({ ...cell })),
                ),
                messages_arr = [],
                changed_flag = !1,
                decayingMessageShown_flag = !1;
              e_gridCopy.flat().forEach((cell_in_effect) => {
                let r_eff = Math.floor(cell_in_effect.id / 4),
                  a_eff = cell_in_effect.id % 4;
                if (("human" === cell_in_effect.content && cell_in_effect.owner !== "human") || ("human" === cell_in_effect.owner && "house" !== cell_in_effect.content) ) { // 人不在房子里才判断氧气死亡
                    if (t.oxygenLevel < 20) {
                        messages_arr.push("氧气浓度低于20%，人类窒息而亡！");
                        e_gridCopy[r_eff][a_eff].content = "human-dead";
                        e_gridCopy[r_eff][a_eff].owner = null; // 如果之前是owner, 也清掉
                        e_gridCopy[r_eff][a_eff].isDecaying = !0;
                        changed_flag = !0;
                    } else if (t.oxygenLevel > 30) {
                        messages_arr.push(
                          "氧气浓度高于30%，人类因含氧量超标死亡！",
                        );
                        e_gridCopy[r_eff][a_eff].content = "human-dead";
                        e_gridCopy[r_eff][a_eff].owner = null;
                        e_gridCopy[r_eff][a_eff].isDecaying = !0;
                        changed_flag = !0;
                    }
                }
    
    
                if (
                  ("human-dead" === cell_in_effect.content ||
                    "tiger-dead" === cell_in_effect.content) &&
                  cell_in_effect.isDecaying
                ) {
                  let decayingObjectName =
                    "human-dead" === cell_in_effect.content ? "骸骨" : "老虎残骸";
                  e_gridCopy[r_eff][a_eff].content = null;
                  e_gridCopy[r_eff][a_eff].isDecaying = !1;
                  changed_flag = !0;
                  decayingMessageShown_flag ||
                    (messages_arr.push(
                      "一具".concat(decayingObjectName, "风化消失了。"),
                    ),
                    (decayingMessageShown_flag = !0));
                }
              });
              messages_arr.length > 0 &&
                messages_arr.forEach((msg) => f_addMessage(msg));
              changed_flag && g_updateGameState(e_gridCopy);
            }, [
              t.oxygenLevel,
              t.grid, // 移除 plantCount, 因为氧气计算不直接依赖它了
              f_addMessage,
              g_updateGameState,
            ]);
    
            (0, l.useEffect)(() => {
              let e_gridCopy_fire = t.grid.map((row) =>
                  row.map((cell) => ({ ...cell })),
                ),
                fireExtinguished_flag = !1,
                currentTime = Date.now();
              e_gridCopy_fire.flat().forEach((cell_fire) => {
                "fire" === cell_fire.content &&
                  cell_fire.fireEndTime &&
                  currentTime >= cell_fire.fireEndTime &&
                  ((cell_fire.content = "ash"),
                  (cell_fire.isFertile = !0), // 火烧完变草木灰，土地肥沃
                  (cell_fire.fireEndTime = void 0),
                  (fireExtinguished_flag = !0),
                  f_addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。"));
              });
              fireExtinguished_flag && g_updateGameState(e_gridCopy_fire);
            }, [t.grid, f_addMessage, g_updateGameState]);
    
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
                let newGrid_flood = t.grid.map(
                  (
                    row_flood,
                  ) =>
                    row_flood.map((cell_flood) => {
                      let tempCell_flood = { ...cell_flood };
                      if ("fire" === tempCell_flood.content) {
                          tempCell_flood.content = "ash";
                          tempCell_flood.isFertile = !0; // 火被浇灭，留下草木灰
                          tempCell_flood.fireEndTime = void 0;
                      } else if ("ash" !== tempCell_flood.content) { // 草木灰地不受影响
                          tempCell_flood.content = null;
                          tempCell_flood.owner = null;
                          tempCell_flood.isFertile = !1; // 其他土地变贫瘠
                      }
                      tempCell_flood.isDecaying = !1; // 洪水清除了所有腐烂状态
                      return tempCell_flood;
                    }),
                );
                n((gs_flood_update) => ({
                  ...gs_flood_update,
                  grid: newGrid_flood,
                  messages: [
                    ...gs_flood_update.messages.slice(-5),
                    "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。",
                  ],
                  woodCount: 0, // 洪水冲走了木头
                  // 其他资源数量可以根据游戏逻辑决定是否清零
                }));
                g_updateGameState(newGrid_flood);
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
    
            const m_handleCellClick = (row_idx, col_idx) => {
                x_saveHistory();
              
                let gridCopy_click = t.grid.map((row) =>
                  row.map((cell) => ({ ...cell })),
                );
                let clickedCell = gridCopy_click[row_idx][col_idx];
                let message_click = "";
                let shouldUpdateGameState = true; // 标记是否需要调用 g_updateGameState
              
                if (r_selectedItem) {
                  if (
                    null === clickedCell.content ||
                    ("ash" === clickedCell.content && "plant" === r_selectedItem)
                  ) {
                    if ("plant" === r_selectedItem) {
                      if (clickedCell.isFertile || "ash" === clickedCell.content) {
                        clickedCell.content = "plant";
                        clickedCell.isFertile = !0;
                        message_click = "放置了 植物";
                      } else {
                        message_click = "土地贫瘠，植物无法生长！请先用火制造草木灰恢复地力。";
                        shouldUpdateGameState = false; // 操作无效，不更新主要游戏状态，只提示信息
                      }
                      setSelectedItem(null);
                    } else if ("human" === r_selectedItem) {
                      // 预先计算放置此人后，对氧气和植物的潜在影响
                      let tempGridForHumanPlacement = gridCopy_click.map(row => row.map(cell => ({...cell})));
                      tempGridForHumanPlacement[row_idx][col_idx].content = "human"; // 假设放置成功
              
                      let tempOxygen = 0;
                      let tempPlantCountForConsumption = 0;
                      let tempActiveHumanCount = 0;
              
                      tempGridForHumanPlacement.flat().forEach(cell => {
                        if (cell.content === "plant") {
                          tempPlantCountForConsumption++;
                          if (t.currentLevel === 3 && !cell.isFertile) {
                            tempOxygen += 1;
                          } else {
                            tempOxygen += 10;
                          }
                        }
                        if (cell.content === "human" || cell.owner === "human") {
                          tempActiveHumanCount++;
                        }
                      });
                      tempOxygen -= 5 * tempActiveHumanCount; // 减去包括新放置的人在内的耗氧
              
                      // 判断如果因为放这个人导致植物被消耗，氧气会进一步减少
                      if (tempActiveHumanCount > 0 && tempActiveHumanCount % 2 === 0 && tempPlantCountForConsumption > 0) {
                          // 假设被消耗的植物是10点产氧（需要更精确判断被消耗植物的类型）
                          // 为了简化预判，我们先粗略估计，或者在实际消耗时再精确计算
                          // 这里的关键是预判氧气是否会低于20%或高于30%
                          // 更准确的做法是，模拟植物被消耗后的氧气
                          let potentialOxygenAfterPlantConsumption = tempOxygen;
                          // 查找一个植物来模拟消耗，并看其产氧量
                          let plantFoundForConsumption = false;
                          for(let r=0; r<5; r++){
                              for(let c=0; c<4; c++){
                                  if(tempGridForHumanPlacement[r][c].content === 'plant'){
                                      if (t.currentLevel === 3 && !tempGridForHumanPlacement[r][c].isFertile) {
                                          potentialOxygenAfterPlantConsumption -= 1;
                                      } else {
                                          potentialOxygenAfterPlantConsumption -= 10;
                                      }
                                      plantFoundForConsumption = true;
                                      break;
                                  }
                              }
                              if(plantFoundForConsumption) break;
                          }
                          if(plantFoundForConsumption) {
                              tempOxygen = potentialOxygenAfterPlantConsumption;
                          }
                      }
                      tempOxygen = Math.max(0, Math.min(100, tempOxygen));
              
              
                      message_click = "放置了 人";
                      if (tempOxygen < 20) {
                        message_click += "，但预计环境氧气浓度将低于20%，人类会窒息而亡！";
                        clickedCell.content = "human-dead"; // 实际放置为死亡状态
                        clickedCell.isDecaying = !0;
                      } else if (tempOxygen > 30) {
                        message_click += "，但预计环境氧气浓度将高于30%，人类会因含氧量超标死亡！";
                        clickedCell.content = "human-dead"; // 实际放置为死亡状态
                        clickedCell.isDecaying = !0;
                      } else {
                        clickedCell.content = "human"; // 实际放置活人
                        if (i(row_idx, col_idx, gridCopy_click)) {
                          message_click += ", 附近有老虎威胁。";
                        } else {
                          message_click += "。";
                        }
              
                        // 实际执行植物消耗
                        let currentTotalHumanCountAfterPlacement = 0;
                        gridCopy_click.flat().forEach(cell => { // 此时 gridCopy_click 已经放了新的人
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
                            let plantCellToRemove = existingPlants_human[plantToRemove_idx];
                            gridCopy_click[plantCellToRemove.r][plantCellToRemove.c].content = null;
                            gridCopy_click[plantCellToRemove.r][plantCellToRemove.c].owner = null;
                            message_click += " 由于人类增多，消耗了一株植物。";
                          } else {
                            message_click += " 人类增多，但没有植物可消耗。";
                          }
                        }
                      }
                      setSelectedItem(null);
                    } else if ("tiger" === r_selectedItem) {
                      clickedCell.content = "tiger";
                      message_click = "放置了 老虎";
                      setSelectedItem(null);
                    }
                  } else if (
                    "human" === r_selectedItem &&
                    "house" === clickedCell.content &&
                    null === clickedCell.owner
                  ) {
                    // 预判人住进房子后的氧气情况
                    let tempGridForHouseMove = gridCopy_click.map(row => row.map(cell => ({...cell})));
                    tempGridForHouseMove[row_idx][col_idx].owner = "human";
              
                    let tempOxygenHouse = 0;
                    let tempPlantCountForConsumptionHouse = 0;
                    let tempActiveHumanCountHouse = 0;
              
                    tempGridForHouseMove.flat().forEach(cell => {
                      if (cell.content === "plant") {
                        tempPlantCountForConsumptionHouse++;
                        if (t.currentLevel === 3 && !cell.isFertile) {
                          tempOxygenHouse += 1;
                        } else {
                          tempOxygenHouse += 10;
                        }
                      }
                      if (cell.content === "human" || cell.owner === "human") {
                        tempActiveHumanCountHouse++;
                      }
                    });
                    tempOxygenHouse -= 5 * tempActiveHumanCountHouse;
              
                    if (tempActiveHumanCountHouse > 0 && tempActiveHumanCountHouse % 2 === 0 && tempPlantCountForConsumptionHouse > 0) {
                        let potentialOxygenAfterPlantConsumptionHouse = tempOxygenHouse;
                        let plantFoundForConsumptionHouse = false;
                        for(let r=0; r<5; r++){
                            for(let c=0; c<4; c++){
                                if(tempGridForHouseMove[r][c].content === 'plant'){
                                    if (t.currentLevel === 3 && !tempGridForHouseMove[r][c].isFertile) {
                                        potentialOxygenAfterPlantConsumptionHouse -= 1;
                                    } else {
                                        potentialOxygenAfterPlantConsumptionHouse -= 10;
                                    }
                                    plantFoundForConsumptionHouse = true;
                                    break;
                                }
                            }
                            if(plantFoundForConsumptionHouse) break;
                        }
                        if(plantFoundForConsumptionHouse){
                            tempOxygenHouse = potentialOxygenAfterPlantConsumptionHouse;
                        }
                    }
                    tempOxygenHouse = Math.max(0, Math.min(100, tempOxygenHouse));
              
                    message_click = "人住进了房子！";
                    if (tempOxygenHouse < 20) {
                        message_click += "但预计房屋内氧气浓度将低于20%，入住的人类会窒息而亡！";
                        // 逻辑上人已经住进去了，但会立刻死。或者阻止入住？按你的描述，是死亡。
                        // 这里我们先让人住进去，然后useEffect会处理死亡。
                        // 但更好的做法是，如果预判会死，则直接让人死在房子里，或者不允许入住。
                        // 为了简化，我们先让人住进去，然后在useEffect中统一处理死亡逻辑。
                        // 不过，如果希望更精确，可以在这里就标记死亡，但这会使代码更复杂。
                        // 我们先按原逻辑，让人住进去，然后让useEffect判断。
                        clickedCell.owner = "human"; // 允许入住
                    } else if (tempOxygenHouse > 30) {
                        message_click += "但预计房屋内氧气浓度将高于30%，入住的人类会因含氧量超标死亡！";
                        clickedCell.owner = "human"; // 允许入住
                    } else {
                      clickedCell.owner = "human";
                    }
              
                    // 实际执行植物消耗 (人住进房子也算增加了一个活跃人类)
                    let currentTotalHumanCountAfterHouseMove = 0;
                    gridCopy_click.flat().forEach(cell => {
                      if (cell.content === "human" || cell.owner === "human") {
                        currentTotalHumanCountAfterHouseMove++;
                      }
                    });
              
                    if (currentTotalHumanCountAfterHouseMove > 0 && currentTotalHumanCountAfterHouseMove % 2 === 0) {
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
                        let plantCellToRemove = existingPlants_human[plantToRemove_idx];
                        gridCopy_click[plantCellToRemove.r][plantCellToRemove.c].content = null;
                        gridCopy_click[plantCellToRemove.r][plantCellToRemove.c].owner = null;
                        message_click += " 由于人类增多，消耗了一株植物。";
                      } else {
                        message_click += " 人类增多，但没有植物可消耗。";
                      }
                    }
                    setSelectedItem(null);
                  } else {
                    message_click = "这个格子已经被占用了或操作无效！";
                    shouldUpdateGameState = false;
                  }
                } else if ("plant" === clickedCell.content) {
                  if (i(row_idx, col_idx, gridCopy_click)) {
                    clickedCell.content = "fire";
                    clickedCell.fireEndTime = Date.now() + 3e4;
                    message_click = h_handleFireEffect(
                      gridCopy_click,
                      (message_click = "植物在老虎的威胁下被点燃了！"),
                    );
                  } else if (t.currentLevel >= 2) {
                    clickedCell.content = "wood";
                    message_click =
                      "植物变成了木头！收集4块木头可以建造房子。";
                  } else {
                    message_click =
                      "点击植物。在第二关及以后，植物可以转化为木头。";
                    shouldUpdateGameState = false; //只是提示，不改变格子状态
                  }
                } else if ("wood" === clickedCell.content && t.currentLevel >= 2) {
                  let woodId_click = clickedCell.id;
                  if (!d_selectedWoods.includes(woodId_click)) {
                    let tempSelectedWoods = [...d_selectedWoods, woodId_click];
                    setSelectedWoods(tempSelectedWoods);
                    message_click = "选择了木头 (".concat(
                      tempSelectedWoods.length,
                      "/4)。",
                    );
                    if (4 === tempSelectedWoods.length) {
                      let housePlaced_flag = !1;
                      for (let r_house = 0; r_house < 5; r_house++) {
                        for (let c_house = 0; c_house < 4; c_house++)
                          if (
                            null === gridCopy_click[r_house][c_house].content ||
                            "ash" === gridCopy_click[r_house][c_house].content
                          ) {
                            gridCopy_click[r_house][c_house].content = "house";
                            gridCopy_click[r_house][c_house].isFertile = !0;
                            message_click = "4块木头合成了一座房子！";
                            tempSelectedWoods.forEach((id_to_remove_wood) => {
                              gridCopy_click[Math.floor(id_to_remove_wood / 4)][
                                id_to_remove_wood % 4
                              ].content = null;
                            });
                            housePlaced_flag = !0;
                            break;
                          }
                        if (housePlaced_flag) break;
                      }
                      housePlaced_flag || (message_click = "没有空地建造房子！");
                      setSelectedWoods([]);
                    }
                  }
                } else if ("plant-dead" === clickedCell.content) {
                  clickedCell.content = "fire";
                  clickedCell.fireEndTime = Date.now() + 3e4;
                  message_click = h_handleFireEffect(
                    gridCopy_click,
                    (message_click = "枯叶被点燃，变成了火！"),
                  );
                } else {
                  message_click =
                    "请先选择一个物品，或点击植物/枯叶进行转化。";
                  shouldUpdateGameState = false; //只是提示
                }
              
                if (message_click) {
                    f_addMessage(message_click);
                }
              
              
                if (shouldUpdateGameState) {
                    let tigerEats_flag = !1;
                    // 老虎吃人逻辑现在基于 gridCopy_click (已经处理了放置和可能的植物消耗)
                    let gridForTigerLogic = gridCopy_click.map((row) =>
                      row.map((cell) => ({ ...cell })),
                    );
              
                    if (t.currentLevel >= 2) {
                      for (let r_tg_row = 0; r_tg_row < 5; r_tg_row++) {
                        for (let c_tg_col = 0; c_tg_col < 4; c_tg_col++) {
                          if ("tiger" === gridForTigerLogic[r_tg_row][c_tg_col].content) {
                            let humanEaten_flag = !1;
                            for (let [dr_tg, dc_tg] of [
                              [-1, 0], [1, 0], [0, -1], [0, 1],
                              [-1, -1], [-1, 1], [1, -1], [1, 1],
                            ]) {
                              let h_row = r_tg_row + dr_tg,
                                h_col = c_tg_col + dc_tg;
                              if (h_row >= 0 && h_row < 5 && h_col >= 0 && h_col < 4) {
                                let targetCell_tg = gridForTigerLogic[h_row][h_col];
                                if (
                                  "human" === targetCell_tg.content &&
                                  targetCell_tg.owner !== "human" // 人不在房子里
                                ) {
                                  gridForTigerLogic[h_row][h_col].content = "human-dead";
                                  gridForTigerLogic[h_row][h_col].isDecaying = !0;
                                  f_addMessage(
                                    "老虎在("
                                      .concat(r_tg_row + 1, ",")
                                      .concat(c_tg_col + 1, ")吃掉了(")
                                      .concat(h_row + 1, ",")
                                      .concat(h_col + 1, ")的人！"),
                                  );
                                  tigerEats_flag = !0;
                                  humanEaten_flag = !0;
                                  break;
                                }
                              }
                            }
                            if (humanEaten_flag) break;
                          }
                        }
                        if (tigerEats_flag) break;
                      }
                    }
                    g_updateGameState(tigerEats_flag ? gridForTigerLogic : gridCopy_click);
                }
              };
    
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
                bgColor_cell = "#E0C9A6"; // 贫瘠土地颜色
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
                              c_history.length > 0 &&
                                (n(c_history[c_history.length - 1]),
                                setHistory(c_history.slice(0, -1)),
                                setSelectedWoods([]),
                                f_addMessage("操作已撤销"));
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
                              n((gs_nextLevel) => ({
                                ...gs_nextLevel,
                                currentLevel: nextLevel,
                                grid: e(),
                                oxygenLevel: 0,
                                plantCount: 0,
                                humanCount: 0,
                                tigerCount: 0,
                                woodCount: 0,
                                timeLeft: 120,
                                isGameOver: !1,
                                messages: ["欢迎来到关卡 ".concat(nextLevel)],
                              }));
                              setSelectedWoods([]), g_updateGameState(e());
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
  