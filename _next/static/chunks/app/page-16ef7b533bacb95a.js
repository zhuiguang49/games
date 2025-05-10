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

      // 规则2: 检查植物周边是否有老虎 (九宫格)
      let isTigerInSurrounding = (r_idx, c_idx, grid) => {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue; // Skip the plant cell itself
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
                  isFertile: !0,
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
          lastPlantConsumedByHumansCount: 0, // 用于精确控制“每2人消耗1植物”
          // 新增：用于记录因操作直接导致的氧气变化量，独立于植物/人数的计算
          directOxygenChangeFromAction: 0,
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

        // 规则1：独立的氧气计算逻辑
        const calculateOxygen = (grid, currentLevel, directChange) => {
            let currentOxygen = directChange; // 从直接操作影响开始

            grid.flat().forEach((cell) => {
                if (cell.content === "plant") {
                    // 产氧逻辑已合并到 directChange 中，这里不再重复计算
                } else if (cell.content === "human" || cell.owner === "human") {
                    // 耗氧逻辑也合并到 directChange 中
                }
            });
            return Math.max(0, Math.min(100, currentOxygen));
        };


        const updateGridAndStats = (0, l.useCallback)((newGrid, actionOxygenChange = 0, customMessage) => {
            let newPlantCount = 0;
            let newHumanCountForDisplay = 0;
            let newTigerCount = 0;
            let newWoodCount = 0;

            newGrid.flat().forEach((cell) => {
              if (cell.content === "plant") newPlantCount++;
              if (cell.content === "human") newHumanCountForDisplay++;
              if (cell.content === "tiger") newTigerCount++;
              if (cell.content === "wood") newWoodCount++;
            });

            // 基于当前 gameState.oxygenLevel 和 actionOxygenChange 来计算新的氧气值
            const updatedOxygenLevel = calculateOxygen(newGrid, gameState.currentLevel, gameState.oxygenLevel + actionOxygenChange);

            setGameState((prev) => {
              const newMessages = customMessage ? [...prev.messages.slice(-5), customMessage] : prev.messages;
              if (prev.plantCount !== newPlantCount ||
                  prev.humanCount !== newHumanCountForDisplay ||
                  prev.tigerCount !== newTigerCount ||
                  prev.woodCount !== newWoodCount ||
                  prev.oxygenLevel !== updatedOxygenLevel || // 使用计算后的氧气值
                  JSON.stringify(prev.grid) !== JSON.stringify(newGrid) ||
                  prev.messages.length !== newMessages.length || !newMessages.every((val, index) => val === prev.messages[index])
                 ) {
                return {
                  ...prev,
                  grid: newGrid,
                  oxygenLevel: updatedOxygenLevel, // 设置计算后的氧气值
                  plantCount: newPlantCount,
                  humanCount: newHumanCountForDisplay,
                  tigerCount: newTigerCount,
                  woodCount: newWoodCount,
                  messages: newMessages,
                  directOxygenChangeFromAction: 0, // 重置直接变化量
                };
              }
              return prev;
            });
          },
          [gameState.currentLevel, gameState.oxygenLevel] // 依赖 currentLevel 和 oxygenLevel
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

        // 死亡判断 useEffect - 规则4
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
              updateGridAndStats(gridCopyForDeath, 0); // 死亡不直接改变氧气，而是通过人数变化间接影响
            }
        }, [gameState.oxygenLevel, gameState.grid, gameState.plantCount, gameState.humanCount, addMessage, updateGridAndStats]);

        // 规则6: 尸体腐烂的 useEffect
        (0, l.useEffect)(() => {
            const decayTimers = [];
            gameState.grid.flat().forEach((cell) => {
            if ( (cell.content === "human-dead" || cell.content === "tiger-dead") && cell.isDecaying ) {
                const timerId = setTimeout(() => {
                setGameState(prev => {
                    const newGrid = prev.grid.map((r, rIndex) => r.map((c, cIndex) => {
                        if (rIndex === Math.floor(cell.id / 4) && cIndex === (cell.id % 4)) {
                            if (c.isDecaying && (c.content === "human-dead" || c.content === "tiger-dead")) {
                                addMessage(`一具${c.content === "human-dead" ? "骸骨" : "老虎残骸"}消失了。`);
                                return {...c, content: null, isDecaying: false };
                            }
                        }
                        return c;
                    }));
                    if (JSON.stringify(newGrid) !== JSON.stringify(prev.grid)) {
                         updateGridAndStats(newGrid, 0); // 腐烂不直接改变氧气
                         return {...prev, grid: newGrid};
                    }
                    return prev;
                });
                }, 1000); // 1秒后消失
                decayTimers.push(timerId);
            }
            });
            return () => decayTimers.forEach(clearTimeout);
        }, [gameState.grid, addMessage, updateGridAndStats]);


        // 规则3: 火焰熄灭的 useEffect
        (0, l.useEffect)(() => {
            let gridChangedByFireOut = false;
            let gridAfterFireOut = gameState.grid.map(row => row.map(cell => ({ ...cell })));

            gameState.grid.flat().forEach((cell) => {
            if (cell.content === "fire" && cell.fireEndTime && Date.now() >= cell.fireEndTime) {
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
              updateGridAndStats(gridAfterFireOut, 0); // 熄灭不直接改变氧气
            }
        }, [gameState.grid, addMessage, updateGridAndStats]);


        // 第三关倒计时和洪水 - 规则7 & 8
        (0, l.useEffect)(() => {
            let interval_id;
            if (3 === gameState.currentLevel && gameState.timeLeft > 0 && !gameState.isGameOver && !gameState.isRaining) {
            interval_id = setInterval(() => {
                setGameState((gs) => ({
                ...gs,
                timeLeft: gs.timeLeft - 1,
                }));
            }, 1000);
            } else if (
            3 === gameState.currentLevel &&
            0 === gameState.timeLeft &&
            !gameState.isGameOver &&
            !gameState.isRaining
            ) {
            addMessage("120秒到！持续强降雨，引发大洪水！");
            setGameState((gs) => ({ ...gs, isRaining: true }));

            setTimeout(() => { // 规则7: 降雨持续3秒
                let newGridAfterFlood = gameState.grid.map((row) =>
                row.map((cell) => {
                    let tempCell = { ...cell };
                    if (tempCell.content === "fire") {
                    tempCell.content = "ash";
                    tempCell.isFertile = true;
                    tempCell.fireEndTime = undefined;
                    } else if (tempCell.content !== "ash") {
                    tempCell.content = null;
                    tempCell.owner = null;
                    tempCell.isFertile = false;
                    }
                    tempCell.isDecaying = false;
                    return tempCell;
                }),
                );
                updateGridAndStats(newGridAfterFlood, 0, "洪水退去。有草木灰的地方土地肥沃（植物产氧10%），其余土地贫瘠（植物产氧1%）。草木灰可以增加土壤肥力！");
                setGameState((gs) => ({
                ...gs,
                isRaining: false,
                // isGameOver: false, // 确保游戏可以继续
                }));
            }, 3000); // 3秒后洪水逻辑结束
            }
            return () => clearInterval(interval_id);
        }, [gameState.currentLevel, gameState.timeLeft, gameState.isGameOver, gameState.isRaining, addMessage, updateGridAndStats, gameState.grid]);

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
            let directOxygenDelta = 0; // 本次操作直接导致的氧气变化

            // 规则5: 老虎存在时不能放置人类（放置之后会被立刻吃掉）
            if (selectedItem === "human" && gameState.tigerCount > 0 && gameState.currentLevel >=2) {
                if (null === clickedCell.content || "ash" === clickedCell.content) {
                    gridCopy[row_idx][col_idx].content = "human-dead"; // 直接变尸体
                    gridCopy[row_idx][col_idx].isDecaying = true;
                    message = "放置了人，但立刻被老虎吃掉了！";
                    // 人被吃，不直接减少氧气，因为他没来得及消耗
                    gridReallyChanged = true;
                    setSelectedItem(null);
                } else if ("house" === clickedCell.content && null === clickedCell.owner) {
                    clickedCell.owner = "human";
                    message = "人住进了房子，躲避了老虎！";
                    directOxygenDelta -= 5; // 人住进房子消耗氧气
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
                        directOxygenDelta += 10; // 规则1：种植植物+10%
                        gridReallyChanged = true;
                    } else if ("human" === selectedItem) {
                        clickedCell.content = "human";
                        message = "放置了人";
                        directOxygenDelta -= 5; // 规则1：放置人类-5% (背景描述是10%，这里按新要求是5%或10%，暂用5)
                                                // 如果你的最新要求是-10%，请修改这里
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
                    directOxygenDelta -= 5; // 规则1
                    gridReallyChanged = true;
                    setSelectedItem(null);
                } else {
                    message = "这个格子已经被占用了或操作无效！";
                }
            } else if ("plant" === clickedCell.content) {
                 // 规则2: 周边（九宫格）有老虎的时候植物才可以燃烧成草木灰，没有老虎的话植物应该是变为木头
                if (gameState.currentLevel >= 2) { // 此逻辑仅在第二关及以后生效
                    if (isTigerInSurrounding(row_idx, col_idx, gridCopy)) {
                        clickedCell.content = "fire";
                        clickedCell.fireEndTime = Date.now() + 20000; // 规则3: 火焰燃烧20秒
                        message = "植物在老虎的威胁下被点燃了！燃烧20秒后将变为草木灰。";
                        directOxygenDelta -= 10; // 规则1：点火-10%
                        gridReallyChanged = true;
                    } else { // 没有老虎威胁，植物变木头
                        clickedCell.content = "wood";
                        message = "植物变成了木头！";
                        directOxygenDelta -= 10; // 规则1：植物变木头-10%
                        gridReallyChanged = true;
                    }
                } else if (gameState.currentLevel === 3 && !clickedCell.isFertile) {
                     // 第三关，点击贫瘠土地上的植物可以变成火来肥沃土地 (与规则2的优先级？)
                     // 假设规则2优先：如果周围有老虎，还是先烧。如果没老虎，才考虑是否是第三关贫瘠地。
                     // 如果要严格按规则10（点击植物变火增加肥力），则此逻辑应优先于变木头。
                     // 当前实现：如果没老虎，且是第三关贫瘠地，也会变火（但不会消耗氧气，因为是为了肥地）
                    clickedCell.content = "fire";
                    clickedCell.fireEndTime = Date.now() + 20000; // 规则3
                    // isFertile 会在火焰熄灭变灰烬时更新
                    message = "植物燃烧成草木灰可以增加土壤肥力。";
                    // 注意：根据背景描述的规则10，这里不应该减氧气，因为目的是增加肥力。
                    // 但如果也遵循规则1的“点火-10%”，则需要 directOxygenDelta -= 10;
                    // 我将遵循规则10，不在此处扣氧气。
                    gridReallyChanged = true;
                }
                 else {
                    message = "点击植物。"; // 默认点击植物无事发生（或按其他规则）
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

                // 规则5 (修改): 老虎吃掉所有不在房屋中的人
                if (gameState.currentLevel >= 2 && tempGrid.some(row => row.some(cell => cell.content === "tiger"))) {
                    let humansEatenThisTurnCount = 0;
                    for (let r_h = 0; r_h < 5; r_h++) {
                        for (let c_h = 0; c_h < 4; c_h++) {
                            // 只吃在格子里的，不吃房子里的
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

                // 人类消耗植物逻辑 (在氧气计算之前，因为这会改变植物数量)
                let finalHumansForPlantConsumption = 0;
                tempGrid.flat().forEach(cell => {
                    if (cell.content === "human" || cell.owner === "human") finalHumansForPlantConsumption++;
                });

                // "每两个人会消耗一棵树" - 仅当人数净增加并跨过2的倍数时消耗
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

                if (finalMessage && finalMessage !== message) {
                     addMessage(finalMessage);
                } else if (message) {
                     addMessage(message);
                }
                updateGridAndStats(tempGrid, directOxygenDelta); // 传递本次操作直接的氧气变化

            } else if (message) {
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
            gameState.timeLeft < 10 ? "red" : gameState.timeLeft < 60 ? "#f57c00" : "black",
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
                    3 === gameState.currentLevel &&
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
                            let nextLevel = gameState.currentLevel < 3 ? gameState.currentLevel + 1 : 1;
                            addMessage(gameState.currentLevel === 3 && nextLevel === 1 ? "重新开始第一关" : `进入关卡 ${nextLevel}`);
                            const newGrid = initialGrid();
                            // updateGridAndStats(newGrid, 0); // 氧气直接设为0，因为是新关卡初始
                            setGameState((prev) => ({ // 先重置大部分状态
                                ...prev,
                                grid: newGrid, // 应用新网格
                                plantCount: 0,
                                humanCount: 0,
                                tigerCount: 0,
                                woodCount: 0,
                                oxygenLevel: 0, // 明确氧气为0
                                currentLevel: nextLevel,
                                timeLeft: 120,
                                isGameOver: !1,
                                isRaining: false,
                                messages: [`欢迎来到关卡 ${nextLevel}`],
                                lastPlantConsumedByHumansCount: 0,
                                directOxygenChangeFromAction: 0,
                            }));
                            // 然后让 updateGridAndStats 根据这个初始干净的状态再跑一次，确保所有计数正确
                            // 但由于我们已经手动设置了 oxygen 为 0, 所以不需要 actionOxygenChange
                            updateGridAndStats(newGrid, 0);

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
                    (0, o.jsx)("div", {
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
                            Array(50).fill(null).map((_, idx) => (
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