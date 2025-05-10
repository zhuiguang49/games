(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [974],
  {
    3662: (e, t, n) => {
      Promise.resolve().then(n.bind(n, 5288));
    },
    5288: (e, t, n_module) => {
      "use strict";
      n_module.d(t, { default: () => GameComponent });
      var o = n_module(2860),
        l = n_module(3200);

      let isTigerInSurrounding = (r_idx, c_idx, grid) => {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            let nr = r_idx + dr;
            let nc = c_idx + dc;
            if (nr >= 0 && nr < 5 && nc >= 0 && nc < 4 && grid[nr][nc].content === "tiger") {
              return true;
            }
          }
        }
        return false;
      };

      const GameComponent = () => {
        const initialGrid = () =>
          Array(5)
            .fill(null)
            .map((_, r_idx) =>
              Array(4)
                .fill(null)
                .map((_, c_idx) => ({
                  id: 4 * r_idx + c_idx,
                  content: null,
                  isFertile: true,
                  owner: null,
                  isDecaying: !1,
                  fireEndTime: undefined,
                })),
            );

        const [gameState, setGameState] = (0, l.useState)({
          grid: initialGrid(),
          oxygenLevel: 0,
          plantCount: 0,
          humanCount: 0,
          tigerCount: 0,
          woodCount: 0,
          currentLevel: 1,
          timeLeft: 120,
          messages: ["欢迎来到生态保护游戏！"],
          isGameOver: !1,
          isRaining: !1,
          lastPlantConsumedByHumansCount: 0,
        });

        const [selectedItem, setSelectedItem] = (0, l.useState)(null);
        const [history, setHistory] = (0, l.useState)([]);
        const [selectedWoods, setSelectedWoods] = (0, l.useState)([]);

        const addMessage = (0, l.useCallback)((messageText) => {
          setGameState((currentGameState) => ({
            ...currentGameState,
            messages: [...currentGameState.messages.slice(-5), messageText],
          }));
        }, []);

        const calculateNewOxygenBasedOnAction = (currentOxygen, actionOxygenChange) => {
            let newOxygen = currentOxygen + actionOxygenChange;
            return Math.max(0, Math.min(100, newOxygen));
        };

        const updateGridAndStats = (0, l.useCallback)((newGrid, actionOxygenChange = 0, customMessage) => {
            let newPlantCount = 0;
            let newHumanCountForDisplay = 0;
            let newTigerCount = 0;
            let newWoodCount = 0;

            newGrid.flat().forEach((cell) => {
              if (cell.content === "plant") newPlantCount++;
              if (cell.content === "human" || cell.owner === "human") newHumanCountForDisplay++;
              if (cell.content === "tiger") newTigerCount++;
              if (cell.content === "wood") newWoodCount++;
            });

            const updatedOxygenLevel = calculateNewOxygenBasedOnAction(gameState.oxygenLevel, actionOxygenChange);

            setGameState((prev) => {
              const newMessages = customMessage ? [...prev.messages.slice(-5), customMessage] : prev.messages;
              // Only update if values have actually changed to prevent unnecessary re-renders
              if (prev.plantCount !== newPlantCount ||
                  prev.humanCount !== newHumanCountForDisplay ||
                  prev.tigerCount !== newTigerCount ||
                  prev.woodCount !== newWoodCount ||
                  prev.oxygenLevel !== updatedOxygenLevel ||
                  JSON.stringify(prev.grid) !== JSON.stringify(newGrid) ||
                  prev.messages.join() !== newMessages.join()
                 ) {
                return {
                  ...prev,
                  grid: newGrid,
                  oxygenLevel: updatedOxygenLevel,
                  plantCount: newPlantCount,
                  humanCount: newHumanCountForDisplay,
                  tigerCount: newTigerCount,
                  woodCount: newWoodCount,
                  messages: newMessages,
                };
              }
              return prev;
            });
          },
          [gameState.oxygenLevel, gameState.currentLevel, gameState.messages]
        );


        const applyFireDamageToTigers = (0, l.useCallback)((currentGrid) => {
            let newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
            let messageLog = "";
            let fireCount = 0;
            newGrid.flat().forEach(cell => {
                if (cell.content === "fire") fireCount++;
            });

            if (fireCount >= 2) {
                for (let r_idx = 0; r_idx < 5; r_idx++) {
                    for (let c_idx = 0; c_idx < 4; c_idx++) {
                        if (newGrid[r_idx][c_idx].content === "tiger") {
                            let adjacentFires = 0;
                            for (let [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                                let adj_r = r_idx + dr;
                                let adj_c = c_idx + dc;
                                if (adj_r >= 0 && adj_r < 5 && adj_c >= 0 && adj_c < 4 && newGrid[adj_r][adj_c].content === "fire") {
                                    adjacentFires++;
                                }
                            }
                            if (adjacentFires >= 2) {
                                newGrid[r_idx][c_idx].content = "tiger-dead";
                                newGrid[r_idx][c_idx].isDecaying = true;
                                messageLog += " 两团火的热量消灭了一只老虎！";
                                return { updatedGrid: newGrid, message: messageLog };
                            }
                        }
                    }
                }
            }
            return { updatedGrid: newGrid, message: messageLog };
        }, []);

        // 死亡判断 useEffect
        (0, l.useEffect)(() => {
            let gridCopyForDeath = gameState.grid.map((row) => row.map((cell) => ({ ...cell })));
            let deathMessages = [];
            let gridChangedDueToDeath = false;
            const currentOxygen = gameState.oxygenLevel;

            gridCopyForDeath.forEach((row, r_idx) => {
            row.forEach((cell, c_idx) => {
                const isHumanInHouse = cell.owner === "human" && cell.content === "house";
                const isHumanOnGrid = cell.content === "human" && cell.owner !== "human";

                if (isHumanInHouse || isHumanOnGrid) {
                    if (currentOxygen < 20 || currentOxygen > 30) {
                        deathMessages.push(
                            `${isHumanInHouse ? "房子里的" : ""}人类因氧气浓度${currentOxygen < 20 ? "低于20%" : "高于30%"}死亡！`
                        );
                        if (isHumanInHouse) {
                            gridCopyForDeath[r_idx][c_idx].owner = null;
                        } else {
                            gridCopyForDeath[r_idx][c_idx].content = "human-dead";
                            gridCopyForDeath[r_idx][c_idx].isDecaying = true;
                        }
                        gridChangedDueToDeath = true;
                    }
                } else if (cell.content === "tiger" && currentOxygen <= 0 && gameState.plantCount === 0 && gameState.humanCount === 0) {
                    deathMessages.push("老虎因环境中无氧气而窒息死亡！");
                    gridCopyForDeath[r_idx][c_idx].content = "tiger-dead";
                    gridCopyForDeath[r_idx][c_idx].isDecaying = true;
                    gridChangedDueToDeath = true;
                } else if ((cell.content === "human" || cell.content === "tiger") && currentOxygen <=0 && gameState.plantCount === 0){
                    const creatureName = cell.content === "human" ? "人类" : "老虎";
                    deathMessages.push(`${creatureName}因环境中无植物提供氧气而窒息死亡！`);
                    gridCopyForDeath[r_idx][c_idx].content = cell.content === "human" ? "human-dead" : "tiger-dead";
                    gridCopyForDeath[r_idx][c_idx].isDecaying = true;
                    gridChangedDueToDeath = true;
                }
            });
            });

            if (deathMessages.length > 0) {
              deathMessages.forEach(addMessage);
            }
            if (gridChangedDueToDeath) {
              updateGridAndStats(gridCopyForDeath, 0);
            }
        }, [gameState.oxygenLevel, gameState.grid, gameState.plantCount, gameState.humanCount, addMessage, updateGridAndStats]);

        // 尸体腐烂 useEffect
        (0, l.useEffect)(() => {
            const decayTimers = [];
            gameState.grid.flat().forEach((cell) => {
            if ( (cell.content === "human-dead" || cell.content === "tiger-dead") && cell.isDecaying ) {
                const timerId = setTimeout(() => {
                setGameState(prev => {
                    let gridNeedsUpdate = false;
                    const newGrid = prev.grid.map((r, rIndex) => r.map((c, cIndex) => {
                        if (rIndex === Math.floor(cell.id / 4) && cIndex === (cell.id % 4)) {
                            if (c.isDecaying && (c.content === "human-dead" || c.content === "tiger-dead")) {
                                addMessage(`一具${c.content === "human-dead" ? "骸骨" : "老虎残骸"}消失了。`);
                                gridNeedsUpdate = true;
                                return {...c, content: null, isDecaying: false };
                            }
                        }
                        return c;
                    }));
                    if (gridNeedsUpdate) {
                         // Call updateGridAndStats directly if grid changed, instead of relying on the setGameState's return
                         // This ensures stats are updated based on the very latest grid.
                         updateGridAndStats(newGrid, 0);
                         return {...prev, grid: newGrid}; // Still return the new state for React
                    }
                    return prev;
                });
                }, 1000);
                decayTimers.push(timerId);
            }
            });
            return () => decayTimers.forEach(clearTimeout);
        }, [gameState.grid, addMessage, updateGridAndStats]); // updateGridAndStats is a dependency now


        // 火焰熄灭 useEffect
        (0, l.useEffect)(() => {
            let gridChangedByFireOut = false;
            let gridAfterFireOut = gameState.grid.map(row => row.map(cell => ({ ...cell })));
            const currentTime = Date.now();

            gameState.grid.flat().forEach((cell) => {
            if (cell.content === "fire" && cell.fireEndTime && currentTime >= cell.fireEndTime) {
                const r = Math.floor(cell.id / 4);
                const c = cell.id % 4;
                gridAfterFireOut[r][c].content = "ash";
                gridAfterFireOut[r][c].isFertile = true;
                gridAfterFireOut[r][c].fireEndTime = undefined;
                gridChangedByFireOut = true;
                addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。");
            }
            });

            if (gridChangedByFireOut) {
              updateGridAndStats(gridAfterFireOut, 0);
            }
        }, [gameState.grid, addMessage, updateGridAndStats]);


        // 第三关倒计时 useEffect
        (0, l.useEffect)(() => {
            let countdownIntervalId;
            if (gameState.currentLevel === 3 && gameState.timeLeft > 0 && !gameState.isGameOver && !gameState.isRaining) {
                countdownIntervalId = setInterval(() => {
                    setGameState(gs => ({ ...gs, timeLeft: gs.timeLeft - 1 }));
                }, 1000);
            } else if (gameState.currentLevel === 3 && gameState.timeLeft === 0 && !gameState.isGameOver && !gameState.isRaining) {
                addMessage("120秒到！持续强降雨，引发大洪水！");
                setGameState(gs => ({ ...gs, isRaining: true, timeLeft: -1 })); // Mark timeLeft as handled, start rain
            }
            return () => clearInterval(countdownIntervalId);
        }, [gameState.currentLevel, gameState.timeLeft, gameState.isGameOver, gameState.isRaining, addMessage]);

        // 第三关下雨及洪水效果 useEffect - 规则1 (新列表)
        (0, l.useEffect)(() => {
            let floodTimeoutId;
            if (gameState.currentLevel === 3 && gameState.isRaining) {
                // Rain visuals are active because isRaining is true
                floodTimeoutId = setTimeout(() => {
                    // This callback executes after 3 seconds of rain
                    setGameState(prevGs => {
                        // Double check if we are still in the raining state for level 3
                        // This prevents applying flood if the game reset during the 3s timeout
                        if (prevGs.currentLevel === 3 && prevGs.isRaining) {
                            let newGridAfterFlood = prevGs.grid.map(row =>
                                row.map(cell => {
                                    let tempCell = { ...cell };
                                    if (tempCell.content === 'fire') {
                                        tempCell.content = 'ash';
                                        tempCell.isFertile = true;
                                        tempCell.fireEndTime = undefined;
                                    } else if (tempCell.content !== 'ash') {
                                        tempCell.content = null;
                                        tempCell.owner = null;
                                        tempCell.isFertile = false;
                                    }
                                    tempCell.isDecaying = false;
                                    return tempCell;
                                })
                            );

                            // Calculate stats and oxygen based on the new grid after flood
                            let newPlantCount = 0;
                            let newHumanCountForDisplay = 0;
                            let newTigerCount = 0;
                            let newWoodCount = 0;
                            let activeHumansForOxygen = 0;
                            let calculatedOxygen = 0;

                            newGridAfterFlood.flat().forEach((cell) => {
                              if (cell.content === "plant") {
                                newPlantCount++;
                                calculatedOxygen += (!cell.isFertile) ? 1 : 10;
                              }
                              if (cell.content === "human" || cell.owner === "human") newHumanCountForDisplay++;
                              if (cell.content === "tiger") newTigerCount++;
                              if (cell.content === "wood") newWoodCount++;
                              if (cell.content === "human" || cell.owner === "human") activeHumansForOxygen++;
                            });
                            calculatedOxygen -= 5 * activeHumansForOxygen;
                            const finalOxygen = Math.max(0, Math.min(100, calculatedOxygen));

                            return {
                                ...prevGs,
                                grid: newGridAfterFlood,
                                isRaining: false, // Rain stops
                                isGameOver: false, // Game continues in Level 3
                                messages: [...prevGs.messages.slice(-5), "洪水退去。有草木灰的地方土地肥沃（植物产氧10%），其余土地贫瘠（植物产氧1%）。草木灰可以增加土壤肥力！"],
                                oxygenLevel: finalOxygen,
                                plantCount: newPlantCount,
                                humanCount: newHumanCountForDisplay,
                                tigerCount: newTigerCount,
                                woodCount: newWoodCount,
                            };
                        }
                        // If not in level 3 anymore or rain already stopped, just ensure isRaining is false.
                        return { ...prevGs, isRaining: false };
                    });
                }, 3000); // Flood effects apply after 3 seconds of rain
            }
            return () => {
                clearTimeout(floodTimeoutId);
            };
        }, [gameState.currentLevel, gameState.isRaining]); // Only depends on these to trigger/cleanup the timeout


        const saveHistory = () => {
            setHistory((prevHistory) => [
            ...prevHistory.slice(-19),
            JSON.parse(JSON.stringify(gameState)),
            ]);
        };

        const selectItemHandler = (itemName) => {
            setSelectedItem(itemName);
            setSelectedWoods([]);
            addMessage(`选择了 ${itemName === "plant" ? "植物" : itemName === "human" ? "人" : "老虎"}`);
        };

        const handleCellClickHandler = (row_idx, col_idx) => {
            saveHistory();
            let gridCopy = gameState.grid.map((row) => row.map((cell) => ({ ...cell })));
            let clickedCell = gridCopy[row_idx][col_idx];
            let message = "";
            let gridReallyChanged = false;
            let directOxygenDelta = 0;

            if (selectedItem === "human" && gameState.tigerCount > 0 && gameState.currentLevel >=2) {
                if (null === clickedCell.content || "ash" === clickedCell.content) {
                    gridCopy[row_idx][col_idx].content = "human-dead";
                    gridCopy[row_idx][col_idx].isDecaying = true;
                    message = "放置了人，但立刻被老虎吃掉了！";
                    gridReallyChanged = true;
                    setSelectedItem(null);
                } else if ("house" === clickedCell.content && null === clickedCell.owner) {
                    clickedCell.owner = "human";
                    message = "人住进了房子，躲避了老虎！";
                    directOxygenDelta -= 5;
                    gridReallyChanged = true;
                    setSelectedItem(null);
                } else {
                    message = "这个格子已经被占用了！";
                }
            } else if (selectedItem) {
                if (null === clickedCell.content || ("ash" === clickedCell.content && "plant" === selectedItem)) {
                    if ("plant" === selectedItem) {
                        clickedCell.content = "plant";
                        clickedCell.isFertile = ("ash" === clickedCell.content) || clickedCell.isFertile;
                        message = "放置了植物";
                        directOxygenDelta += 10;
                        gridReallyChanged = true;
                    } else if ("human" === selectedItem) {
                        clickedCell.content = "human";
                        message = "放置了人";
                        directOxygenDelta -= 5;
                        if (isTigerInSurrounding(row_idx, col_idx, gridCopy) && gameState.currentLevel >=2) message += "，附近有老虎威胁。";
                        gridReallyChanged = true;
                    } else if ("tiger" === selectedItem && gameState.currentLevel >= 2) {
                        clickedCell.content = "tiger";
                        message = "放置了老虎";
                        gridReallyChanged = true;
                    }
                    setSelectedItem(null);
                } else if ("human" === selectedItem && "house" === clickedCell.content && null === clickedCell.owner) {
                    clickedCell.owner = "human";
                    message = "人住进了房子！";
                    directOxygenDelta -= 5;
                    gridReallyChanged = true;
                    setSelectedItem(null);
                } else {
                    message = "这个格子已经被占用了或操作无效！";
                }
            } else if ("plant" === clickedCell.content) {
                if (gameState.currentLevel >= 2) {
                    if (isTigerInSurrounding(row_idx, col_idx, gridCopy)) {
                        clickedCell.content = "fire";
                        clickedCell.fireEndTime = Date.now() + 20000;
                        message = "植物在老虎的威胁下被点燃了！燃烧20秒后将变为草木灰。";
                        directOxygenDelta -= 10;
                        gridReallyChanged = true;
                    } else {
                        clickedCell.content = "wood";
                        message = "植物变成了木头！";
                        directOxygenDelta -= 10;
                        gridReallyChanged = true;
                    }
                } else if (gameState.currentLevel === 3 && !clickedCell.isFertile && clickedCell.content === "plant") {
                    clickedCell.content = "fire";
                    clickedCell.fireEndTime = Date.now() + 20000;
                    message = "植物燃烧成草木灰可以增加土壤肥力。";
                    gridReallyChanged = true;
                } else {
                    message = "点击植物。";
                }
            } else if ("wood" === clickedCell.content && gameState.currentLevel >= 2) {
                let woodId = clickedCell.id;
                if (!selectedWoods.includes(woodId)) {
                    const newSelectedWoods = [...selectedWoods, woodId];
                    setSelectedWoods(newSelectedWoods);
                    message = `选择了木头 (${newSelectedWoods.length}/4)。`;
                    if (newSelectedWoods.length === 4) {
                    let housePlaced = false;
                    for (let r_house = 0; r_house < 5; r_house++) {
                        for (let c_house = 0; c_house < 4; c_house++) {
                        if (null === gridCopy[r_house][c_house].content || "ash" === gridCopy[r_house][c_house].content) {
                            gridCopy[r_house][c_house].content = "house";
                            gridCopy[r_house][c_house].isFertile = true;
                            message = "4块木头合成了一座房子！";
                            newSelectedWoods.forEach((id_to_remove) => {
                            gridCopy[Math.floor(id_to_remove / 4)][id_to_remove % 4].content = null;
                            });
                            housePlaced = true;
                            gridReallyChanged = true;
                            break;
                        }
                        }
                        if (housePlaced) break;
                    }
                    if (!housePlaced) message = "没有空地建造房子！";
                    setSelectedWoods([]);
                    }
                }
            } else {
                message = "请先选择一个物品，或点击植物进行转化。";
            }

            if (gridReallyChanged) {
                let tempGrid = gridCopy.map(row => row.map(cell => ({ ...cell })));
                let finalMessage = message;

                if (gameState.currentLevel >= 2 && tempGrid.some(row => row.some(cell => cell.content === "tiger"))) {
                    let humansEatenThisTurnCount = 0;
                    for (let r_h = 0; r_h < 5; r_h++) {
                        for (let c_h = 0; c_h < 4; c_h++) {
                            if (tempGrid[r_h][c_h].content === "human" && tempGrid[r_h][c_h].owner !== "human") {
                                tempGrid[r_h][c_h].content = "human-dead";
                                tempGrid[r_h][c_h].isDecaying = true;
                                humansEatenThisTurnCount++;
                            }
                        }
                    }
                    if (humansEatenThisTurnCount > 0) {
                        finalMessage += ` 老虎出没，吃掉了 ${humansEatenThisTurnCount} 个不在房子里的人！`;
                    }
                }

                const { updatedGrid: gridAfterFire, message: fireMessage } = applyFireDamageToTigers(tempGrid);
                if (fireMessage) {
                    finalMessage = (finalMessage && finalMessage !== message ? finalMessage + " " : "") + fireMessage;
                }
                tempGrid = gridAfterFire;

                let finalHumansForPlantConsumption = 0;
                tempGrid.flat().forEach(cell => {
                    if (cell.content === "human" || cell.owner === "human") finalHumansForPlantConsumption++;
                });

                let currentGroupsOfTwo = Math.floor(finalHumansForPlantConsumption / 2);
                let previousGroupsOfTwo = Math.floor(gameState.lastPlantConsumedByHumansCount / 2);

                if (currentGroupsOfTwo > previousGroupsOfTwo && finalHumansForPlantConsumption > 0) {
                    let plantsToConsume = currentGroupsOfTwo - previousGroupsOfTwo;
                    let plantsAvailable = [];
                    tempGrid.forEach((row, r_idx) => row.forEach((cell, c_idx) => {
                        if (cell.content === "plant") plantsAvailable.push({ r: r_idx, c: c_idx });
                    }));

                    for (let k = 0; k < plantsToConsume; k++) {
                        if (plantsAvailable.length > 0) {
                            const plantToRemoveIndex = Math.floor(Math.random() * plantsAvailable.length);
                            const plantToRemove = plantsAvailable.splice(plantToRemoveIndex, 1)[0];
                            tempGrid[plantToRemove.r][plantToRemove.c].content = null;
                            finalMessage = (finalMessage ? finalMessage + " " : "") + "由于人类增多，消耗了一株植物。";
                        } else {
                            finalMessage = (finalMessage ? finalMessage + " " : "") + "人类增多，但没有足够的植物可消耗。";
                            break;
                        }
                    }
                     if (plantsToConsume > 0) {
                         setGameState(prev => ({ ...prev, lastPlantConsumedByHumansCount: finalHumansForPlantConsumption }));
                     }
                }

                if (finalMessage && finalMessage !== message && finalMessage.trim() !== "") { // Ensure non-empty and different
                     addMessage(finalMessage);
                } else if (message && message.trim() !== "") {
                     addMessage(message);
                }
                updateGridAndStats(tempGrid, directOxygenDelta);

            } else if (message && message.trim() !== "") {
                addMessage(message);
            }
        };


        const getCellIcon = (cell) => {
            return cell.content === "plant"
            ? "\uD83C\uDF3F"
            : cell.content === "plant-dead"
                ? "\uD83C\uDF42"
                : cell.content === "human"
                ? "\uD83E\uDDD1"
                : cell.content === "human-dead"
                    ? "\uD83D\uDC80"
                    : cell.content === "tiger"
                    ? "\uD83D\uDC05"
                    : cell.content === "tiger-dead"
                        ? "☠️"
                        : cell.content === "fire"
                        ? "\uD83D\uDD25"
                        : cell.content === "wood"
                            ? selectedWoods.includes(cell.id)
                            ? "\uD83E\uDEB5✨"
                            : "\uD83E\uDEB5"
                            : cell.content === "house"
                            ? cell.owner === "human"
                                ? "\uD83C\uDFE0\uD83E\uDDD1"
                                : "\uD83C\uDFE0"
                            : cell.content === "ash"
                                ? "\uD83E\uDEA8"
                                : "";
        }


        const getCellStyle = (cell) => {
            let backgroundColor = "#D2B48C";
            if (cell.content === "fire") backgroundColor = "#ffcc80";
            else if (cell.content === "ash") backgroundColor = "#A0A0A0";
            else if (gameState.currentLevel === 3 && !cell.isFertile && cell.content !== "house" && cell.content !== "ash") backgroundColor = "#E0C9A6";
            else if (cell.isFertile && cell.content !== "house") backgroundColor = "#B8860B";

            return {
            border: "1px solid #a5d6a7",
            backgroundColor: backgroundColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5em",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.1s ease",
            borderRadius: "4px",
            boxShadow: selectedWoods.includes(cell.id) ? "0 0 5px 2px yellow" : "none",
            };
        };

        let buttonStyle = {
            padding: "10px 15px",
            fontSize: "1em",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            margin: "5px",
        };
        let textStyle = {
            margin: "5px 0",
            fontSize: "0.9em",
            color: "black",
        };
        let headerStyle = {
            color: "black",
            marginTop: "15px",
            flexShrink: 0,
        };
        let timerDisplayStyle = {
            textAlign: "center",
            color:
            gameState.timeLeft < 10 && gameState.timeLeft >=0 ? "red" : gameState.timeLeft < 60 && gameState.timeLeft >=0 ? "#f57c00" : "black",
            marginTop: "0",
            marginBottom: "10px",
            flexShrink: 0,
        };

        return (0, o.jsx)("div", {
            style: {
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "100vh", width: "100vw",
            padding: "0px", margin: "0px", boxSizing: "border-box",
            backgroundColor: "#001f3f",
            },
            children: (0, o.jsxs)("div", {
            style: {
                display: "flex", flexDirection: "row", backgroundColor: "#e0f2f1",
                padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                width: "100%", height: "100%", maxWidth: "1200px", maxHeight: "95vh",
                boxSizing: "border-box", overflow: "hidden", position: "relative",
            },
            children: [
                (0, o.jsxs)("div", {
                style: {
                    flexGrow: 1, marginRight: "20px", display: "flex",
                    flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "10px",
                },
                children: [
                    (0, o.jsx)("h1", {
                    style: {
                        textAlign: "center", fontSize: "1.5em", color: "#2e7d32",
                        marginBottom: "5px", flexShrink: 0,
                    },
                    children: "创设氧气浓度适宜生物多样化的环境",
                    }),
                    (0, o.jsxs)("h2", {
                    style: {
                        textAlign: "center", fontSize: "1.2em", color: "#4caf50",
                        marginTop: "0", marginBottom: "10px", flexShrink: 0,
                    },
                    children: ["当前关卡：", gameState.currentLevel],
                    }),
                    3 === gameState.currentLevel && gameState.timeLeft >= 0 &&
                    (0, o.jsxs)("h3", {
                        style: timerDisplayStyle,
                        children: ["倒计时: ", gameState.timeLeft, "s"],
                    }),
                    (0, o.jsx)("div", {
                    style: {
                        display: "grid", gridTemplateColumns: `repeat(4, 80px)`,
                        gridTemplateRows: `repeat(5, 80px)`, gap: "5px",
                        border: "2px solid #a5d6a7", margin: "20px auto",
                        backgroundColor: "#c8e6c9", borderRadius: "8px", padding: "5px",
                    },
                    children: gameState.grid.flat().map((cell) =>
                        (0, o.jsx)(
                        "div",
                        {
                            onClick: () => handleCellClickHandler(Math.floor(cell.id / 4), cell.id % 4),
                            style: getCellStyle(cell),
                            title: cell.content || (cell.isFertile ? (cell.content === "ash" ? "草木灰土地" : "空地") : "贫瘠土地"),
                            onMouseEnter: (e) => (e.currentTarget.style.transform = "scale(1.05)"),
                            onMouseLeave: (e) => (e.currentTarget.style.transform = "scale(1)"),
                            children: getCellIcon(cell),
                        },
                        cell.id,
                        ),
                    ),
                    }),
                    (0, o.jsxs)("div", {
                    style: { textAlign: "center", marginTop: "20px", flexShrink: 0 },
                    children: [
                        (0, o.jsx)("button", {
                        onClick: () => {
                            if (history.length > 0) {
                            const previousState = history[history.length - 1];
                            setGameState(previousState);
                            setHistory(history.slice(0, -1));
                            setSelectedItem(null);
                            setSelectedWoods([]);
                            addMessage("操作已撤销");
                            }
                        },
                        style: buttonStyle,
                        children: "撤销",
                        }),
                        (0, o.jsx)("button", {
                        onClick: () => {
                            saveHistory();
                            const newGrid = initialGrid();
                            const targetLevel = gameState.currentLevel < 3 ? gameState.currentLevel + 1 : 1;
                            const initialMessage = targetLevel === 1 ? "欢迎来到生态保护游戏！" : `欢迎来到关卡 ${targetLevel}`;
                            const transitionMessage = gameState.currentLevel === 3 && targetLevel === 1 ? "游戏结束，重新开始第一关" : `进入关卡 ${targetLevel}`;
                            addMessage(transitionMessage);

                            setGameState({ // Directly set the full initial state for the new/reset level
                                grid: newGrid,
                                oxygenLevel: 0, // Crucial: Reset oxygen for new level
                                plantCount: 0,
                                humanCount: 0,
                                tigerCount: 0,
                                woodCount: 0,
                                currentLevel: targetLevel,
                                timeLeft: 120,
                                messages: [initialMessage],
                                isGameOver: false,
                                isRaining: false, // Ensure rain is stopped on level change
                                lastPlantConsumedByHumansCount: 0,
                            });
                            setSelectedItem(null);
                            setSelectedWoods([]);
                        },
                        style: { ...buttonStyle, marginLeft: "10px" },
                        children: gameState.currentLevel === 3 ? "重新开始游戏" : "进入下一关",
                        }),
                    ],
                    }),
                ],
                }),
                (0, o.jsxs)("div", {
                style: {
                    width: "300px", paddingLeft: "20px", borderLeft: "1px solid #bcaaa4",
                    display: "flex", flexDirection: "column", overflowY: "auto",
                    flexShrink: 0, padding: "10px",
                },
                children: [
                    (0, o.jsx)("h3", { style: headerStyle, children: "可选生物/物品:" }),
                    (0, o.jsx)("div", {
                    style: { marginBottom: "15px", flexShrink: 0 },
                    children: [
                        { name: "plant", label: "植物 🌿" },
                        { name: "human", label: "人 🧑" },
                        ...(gameState.currentLevel >= 2 ? [{ name: "tiger", label: "老虎 🐅" }] : []),
                    ].filter(item => !(item.name === 'tiger' && gameState.currentLevel === 1))
                    .map((item) =>
                        (0, o.jsx)(
                        "button",
                        {
                            onClick: () => selectItemHandler(item.name),
                            style: {
                            padding: "10px", margin: "5px 0", width: "100%", fontSize: "1em", cursor: "pointer",
                            backgroundColor: selectedItem === item.name ? "#a5d6a7" : "#fff",
                            border: "1px solid #a5d6a7", borderRadius: "5px", color: "#333", textAlign: "left",
                            },
                            children: item.label,
                        },
                        item.name,
                        ),
                    ),
                    }),
                    (0, o.jsx)("h3", { style: headerStyle, children: "状态显示:" }),
                    (0, o.jsxs)("div", {
                    style: { marginBottom: "10px", flexShrink: 0 },
                    children: [
                        (0, o.jsxs)("p", { style: textStyle, children: ["氧气浓度: ", gameState.oxygenLevel, "%"] }),
                        (0, o.jsx)("div", {
                        style: { width: "100%", backgroundColor: "#ddd", borderRadius: "3px", height: "20px", overflow: "hidden" },
                        children: (0, o.jsx)("div", {
                            style: {
                            width: `${gameState.oxygenLevel}%`,
                            backgroundColor: gameState.oxygenLevel < 20 || gameState.oxygenLevel > 30 ? "#f44336" : "#4caf50",
                            height: "100%", borderRadius: "3px", transition: "width 0.5s ease-in-out",
                            },
                        }),
                        }),
                    ],
                    }),
                    (0, o.jsxs)("p", { style: textStyle, children: ["植物数量: ", gameState.plantCount, " 🌿"] }),
                    (0, o.jsxs)("p", { style: textStyle, children: ["人类数量: ", gameState.humanCount, " 🧑"] }),
                    (0, o.jsxs)("p", { style: textStyle, children: ["老虎数量: ", gameState.tigerCount, " 🐅"] }),
                    (0, o.jsxs)("p", { style: textStyle, children: ["木头数量: ", gameState.woodCount, " 🪵"] }),
                    (0, o.jsx)("h3", { style: headerStyle, children: "信息提示:" }),
                    (0, o.jsx)("textarea", {
                    readOnly: !0,
                    value: gameState.messages.join("\n"),
                    style: {
                        width: "100%", minHeight: "100px", flexGrow: 1, border: "1px solid #a5d6a7",
                        borderRadius: "5px", padding: "10px", fontSize: "0.9em", backgroundColor: "#f1f8e9",
                        boxSizing: "border-box", resize: "none", color: "black",
                    },
                    }),
                ],
                }),
                gameState.isRaining && gameState.currentLevel === 3 && (
                    (0, o.jsxs)("div", {
                        style: {
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: 'rgba(70, 100, 150, 0.4)', zIndex: 10,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'flex-start',
                            pointerEvents: 'none', overflow: 'hidden',
                        },
                        children: [
                            (0, o.jsx)("div", {
                                style: {
                                    fontSize: '5em', color: 'darkslategrey',
                                    marginTop: '5%', animation: 'cloudMove 10s linear infinite alternate',
                                },
                                children: "☁️"
                            }),
                            ...Array(50).fill(null).map((_, idx) => (
                                (0, o.jsx)("div", {
                                    style: {
                                        position: 'absolute', left: `${Math.random() * 100}%`,
                                        width: '2px', height: `${10 + Math.random() * 10}px`,
                                        backgroundColor: 'lightblue',
                                        animation: `fall ${0.5 + Math.random() * 0.5}s linear infinite`,
                                        top: `${-20 - Math.random() * 30}px`,
                                        animationDelay: `${Math.random() * 2}s`,
                                    }
                                }, `drop-${idx}`)
                            ))
                        ]
                    })
                ),
                (0, o.jsx)("style", {
                    children: `
                        @keyframes fall {
                            to {
                                transform: translateY(100vh);
                                opacity: 0;
                            }
                        }
                        @keyframes cloudMove {
                            0% { transform: translateX(-20px); }
                            100% { transform: translateX(20px); }
                        }
                    `
                })
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