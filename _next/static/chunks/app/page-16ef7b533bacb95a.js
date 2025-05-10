(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [974],
  {
    3662: (e, t, n) => {
      Promise.resolve().then(n.bind(n, 5288));
    },
    5288: (e, t, n_module) => { // <--- 修改这里的参数名，避免与导出名冲突
      "use strict";
      n_module.d(t, { default: () => GameComponent }); // <--- 将导出的组件命名为 GameComponent
      var o = n_module(2860),
        l = n_module(3200);

      let isTigerNear = (e, t, grid) => { // <--- 重命名函数 i
        for (let [o_dr, l_dc] of [
          [-1, 0], [1, 0], [0, -1], [0, 1],
          [-1, -1], [-1, 1], [1, -1], [1, 1],
        ]) {
          let i_r = e + o_dr,
            r_c = t + l_dc;
          if (
            i_r >= 0 &&
            i_r < 5 &&
            r_c >= 0 &&
            r_c < 4 &&
            "tiger" === grid[i_r][r_c].content
          )
            return !0;
        }
        return !1;
      };

      const GameComponent = () => { // <--- 主要组件函数名修改为 GameComponent
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

        const updateGridAndStats = (0, l.useCallback)((newGrid, customMessage) => {
            let newPlantCount = 0;
            let newHumanCountForDisplay = 0;
            let newTigerCount = 0;
            let newWoodCount = 0;
            let activeHumansForOxygen = 0;
            let calculatedOxygen = 0;

            newGrid.flat().forEach((cell) => {
              if (cell.content === "plant") {
                newPlantCount++;
                calculatedOxygen += (gameState.currentLevel === 3 && !cell.isFertile) ? 1 : 10;
              }
              if (cell.content === "human") newHumanCountForDisplay++;
              if (cell.content === "tiger") newTigerCount++;
              if (cell.content === "wood") newWoodCount++;
              if (cell.content === "human" || cell.owner === "human") {
                activeHumansForOxygen++;
              }
            });

            calculatedOxygen -= 5 * activeHumansForOxygen;
            const finalOxygen = Math.max(0, Math.min(100, calculatedOxygen));

            setGameState((prev) => {
              const newMessages = customMessage ? [...prev.messages.slice(-5), customMessage] : prev.messages;
               // 只有当实际值改变时才更新，以避免不必要的重渲染触发useEffect
               // 注意：对于grid的比较，JSON.stringify可能在性能敏感场景下不是最优，但对于小网格是可接受的
              if (prev.plantCount !== newPlantCount ||
                  prev.humanCount !== newHumanCountForDisplay ||
                  prev.tigerCount !== newTigerCount ||
                  prev.woodCount !== newWoodCount ||
                  prev.oxygenLevel !== finalOxygen ||
                  JSON.stringify(prev.grid) !== JSON.stringify(newGrid) ||
                  prev.messages.length !== newMessages.length || !newMessages.every((val, index) => val === prev.messages[index])
                 ) {
                return {
                  ...prev,
                  grid: newGrid,
                  oxygenLevel: finalOxygen,
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
          [gameState.currentLevel] // 确保currentLevel变化时，产氧逻辑能正确更新
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

                if (isHumanInHouse || isHumanOnGrid) { // 包含了规则4：住进房子的人类也需要满足氧气区间
                    if (currentOxygen < 20 || currentOxygen > 30) {
                        deathMessages.push(
                            `${isHumanInHouse ? "房子里的" : ""}人类因氧气浓度${currentOxygen < 20 ? "低于20%" : "高于30%"}死亡！`
                        );
                        if (isHumanInHouse) {
                            gridCopyForDeath[r_idx][c_idx].owner = null; // 人死了，房子空了，但房子还在
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
              updateGridAndStats(gridCopyForDeath);
            }
        }, [gameState.oxygenLevel, gameState.grid, gameState.plantCount, gameState.humanCount, addMessage, updateGridAndStats]);

        // 尸体腐烂的 useEffect - 规则6
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
                         updateGridAndStats(newGrid);
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


        // 火焰熄灭的 useEffect
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
            updateGridAndStats(gridAfterFireOut);
            }
        }, [gameState.grid, addMessage, updateGridAndStats]);


        // 第三关倒计时和洪水 - 规则7
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
            setGameState((gs) => ({ ...gs, isRaining: true })); // 开始下雨视觉效果

            setTimeout(() => { // 雨持续3秒
                let newGridAfterFlood = gameState.grid.map((row) =>
                row.map((cell) => {
                    let tempCell = { ...cell };
                    if (tempCell.content === "fire") {
                    tempCell.content = "ash";
                    tempCell.isFertile = true;
                    tempCell.fireEndTime = undefined;
                    } else if (tempCell.content !== "ash") { // 草木灰除外
                    tempCell.content = null;
                    tempCell.owner = null;
                    tempCell.isFertile = false;
                    }
                    tempCell.isDecaying = false;
                    return tempCell;
                }),
                );
                // 规则8: 提示草木灰作用
                updateGridAndStats(newGridAfterFlood, "洪水退去。有草木灰的地方土地肥沃（植物产氧10%），其余土地贫瘠（植物产氧1%）。");
                setGameState((gs) => ({
                ...gs,
                isRaining: false, // 雨停了
                // isGameOver: false, // 确保游戏可以继续 - 规则8
                }));
            }, 3000); // 3秒后洪水结束
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

            // 规则5: 老虎存在时不能放置人类（放置之后会被立刻吃掉）
            if (selectedItem === "human" && gameState.tigerCount > 0) {
                if (null === clickedCell.content || "ash" === clickedCell.content) {
                    // 允许放置，但会马上被吃
                    gridCopy[row_idx][col_idx].content = "human-dead";
                    gridCopy[row_idx][col_idx].isDecaying = true;
                    message = "放置了人，但立刻被老虎吃掉了！";
                    gridReallyChanged = true;
                    setSelectedItem(null);
                } else if ("house" === clickedCell.content && null === clickedCell.owner) {
                     // 如果是往空房子里放人，则安全
                    clickedCell.owner = "human";
                    message = "人住进了房子，躲避了老虎！";
                    gridReallyChanged = true;
                    setSelectedItem(null);
                }
                 else {
                    message = "这个格子已经被占用了！";
                }
            } else if (selectedItem) {
                if (null === clickedCell.content || ("ash" === clickedCell.content && "plant" === selectedItem)) {
                    if ("plant" === selectedItem) {
                        // 规则8：第三关贫瘠土地上种植
                        if (gameState.currentLevel === 3 && !clickedCell.isFertile && clickedCell.content !== "ash") {
                             // 已经是贫瘠地，可以种，但产氧少
                             clickedCell.content = "plant";
                             // isFertile 保持 false
                             message = "在贫瘠土地上种植了植物";
                             gridReallyChanged = true;
                        } else { // 正常或灰烬地
                            clickedCell.content = "plant";
                            clickedCell.isFertile = true; // 灰烬地种植物也是肥沃的
                            message = "放置了植物";
                            gridReallyChanged = true;
                        }

                    } else if ("human" === selectedItem) {
                        // 老虎吃人逻辑已在前置if处理，这里是无老虎或老虎不吃的情况
                        clickedCell.content = "human";
                        message = "放置了人";
                        if (isTigerNear(row_idx, col_idx, gridCopy)) message += "，附近有老虎威胁。";
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
                    gridReallyChanged = true;
                    setSelectedItem(null);
                } else {
                    message = "这个格子已经被占用了或操作无效！";
                }
            } else if ("plant" === clickedCell.content) {
                if (isTigerNear(row_idx, col_idx, gridCopy) && gameState.currentLevel >= 2) {
                    clickedCell.content = "fire";
                    clickedCell.fireEndTime = Date.now() + 10000;
                    message = "植物在老虎的威胁下被点燃了！";
                    gridReallyChanged = true;
                } else if (gameState.currentLevel >= 2 && gameState.currentLevel !== 3 && clickedCell.isFertile) {
                    clickedCell.content = "wood";
                    message = "植物变成了木头！";
                    gridReallyChanged = true;
                } else if (gameState.currentLevel === 3 && (!clickedCell.isFertile || clickedCell.content === "plant")) {
                     // 第三关，点击任何植物（无论土地是否肥沃）都可以变成火来肥沃土地
                    clickedCell.content = "fire";
                    clickedCell.fireEndTime = Date.now() + 10000;
                    // isFertile 会在火焰熄灭变灰烬时更新
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

            // --- Start of combined logic for tiger eating and fire effects ---
            if (gridReallyChanged) {
                let tempGrid = gridCopy.map(row => row.map(cell => ({ ...cell })));
                let finalMessage = message; // Start with the message from the click

                // 1. Tiger eating logic - 规则5修改：老虎吃掉所有不在房屋中的人
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


                // 2. Fire damage to tigers
                const { updatedGrid: gridAfterFire, message: fireMessage } = applyFireDamageToTigers(tempGrid);
                if (fireMessage) {
                    finalMessage = (finalMessage && finalMessage !== message ? finalMessage + " " : "") + fireMessage;
                }
                tempGrid = gridAfterFire;


                // 3. Human consumption of plants
                let finalHumansForPlantConsumption = 0;
                tempGrid.flat().forEach(cell => {
                    if (cell.content === "human" || cell.owner === "human") finalHumansForPlantConsumption++;
                });

                let plantsConsumedThisTurn = 0;
                if (finalHumansForPlantConsumption > gameState.lastPlantConsumedByHumansCount) {
                    // 计算因为人数 *净增加* 而需要消耗的植物数量
                    // 每增加两个人，消耗一棵树
                    let netNewHumansGroupsOfTwo = Math.floor(finalHumansForPlantConsumption / 2) - Math.floor(gameState.lastPlantConsumedByHumansCount / 2);

                    if (netNewHumansGroupsOfTwo > 0) {
                        let plantsAvailable = [];
                        tempGrid.forEach((row, r_idx) => row.forEach((cell, c_idx) => {
                            if (cell.content === "plant") plantsAvailable.push({ r: r_idx, c: c_idx });
                        }));

                        for (let k = 0; k < netNewHumansGroupsOfTwo; k++) {
                            if (plantsAvailable.length > 0) {
                                const plantToRemoveIndex = Math.floor(Math.random() * plantsAvailable.length);
                                const plantToRemove = plantsAvailable.splice(plantToRemoveIndex, 1)[0];
                                tempGrid[plantToRemove.r][plantToRemove.c].content = null;
                                plantsConsumedThisTurn++;
                            } else {
                                finalMessage += " 人类增多，但没有足够的植物可消耗。";
                                break;
                            }
                        }
                        if (plantsConsumedThisTurn > 0) {
                             finalMessage += ` 由于人类增多，消耗了 ${plantsConsumedThisTurn} 株植物。`;
                             setGameState(prev => ({ ...prev, lastPlantConsumedByHumansCount: finalHumansForPlantConsumption - (finalHumansForPlantConsumption % 2) }));
                        }
                    }
                }

                if (finalMessage && finalMessage !== message) {
                     addMessage(finalMessage);
                } else if (message) {
                     addMessage(message);
                }
                updateGridAndStats(tempGrid);

            } else if (message) {
                addMessage(message);
            }
        };


        const getCellIcon = (cell) => {
            // ... (保持原样)
            return cell.content === "plant"
            ? "\uD83C\uDF3F" // 🌿
            : cell.content === "plant-dead"
                ? "\uD83C\uDF42" // 🍂
                : cell.content === "human"
                ? "\uD83E\uDDD1" // 🧑
                : cell.content === "human-dead"
                    ? "\uD83D\uDC80" // 💀
                    : cell.content === "tiger"
                    ? "\uD83D\uDC05" // 🐅
                    : cell.content === "tiger-dead"
                        ? "☠️"
                        : cell.content === "fire"
                        ? "\uD83D\uDD25" // 🔥
                        : cell.content === "wood"
                            ? selectedWoods.includes(cell.id)
                            ? "\uD83E\uDEB5✨"
                            : "\uD83E\uDEB5"
                            : cell.content === "house"
                            ? cell.owner === "human"
                                ? "\uD83C\uDFE0\uD83E\uDDD1" // 🏠🧑
                                : "\uD83C\uDFE0" // 🏠
                            : cell.content === "ash"
                                ? "\uD83E\uDEA8"
                                : "";
        }


        const getCellStyle = (cell) => {
            // ... (保持原样，但颜色可以微调)
            let backgroundColor = "#D2B48C"; // 默认土壤
            if (cell.content === "fire") backgroundColor = "#ffcc80";
            else if (cell.content === "ash") backgroundColor = "#A0A0A0"; // 灰烬用稍深的灰色
            else if (gameState.currentLevel === 3 && !cell.isFertile && cell.content !== "house" && cell.content !== "ash") backgroundColor = "#E0C9A6"; // 第三关贫瘠土地
            else if (cell.isFertile && cell.content !== "house") backgroundColor = "#B8860B"; // 肥沃土地用深金黄色

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
                            updateGridAndStats(newGrid);
                            setGameState((prev) => ({
                                ...prev,
                                currentLevel: nextLevel,
                                timeLeft: 120,
                                isGameOver: !1,
                                isRaining: false,
                                messages: [`欢迎来到关卡 ${nextLevel}`],
                                lastPlantConsumedByHumansCount: 0,
                            }));
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
                        // 规则1: 第一关不显示老虎图标
                        ...(gameState.currentLevel >= 2 ? [{ name: "tiger", label: "老虎 🐅" }] : []),
                    ].map((item) =>
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
                            display: 'flex', flexDirection: 'column', // 让乌云和雨滴垂直排列
                            alignItems: 'center', justifyContent: 'flex-start', // 乌云在顶部
                            pointerEvents: 'none', overflow: 'hidden',
                        },
                        children: [
                            // 乌云 (简单示意)
                            (0, o.jsx)("div", {
                                style: {
                                    fontSize: '5em', // 调整大小
                                    color: 'darkslategrey',
                                    marginTop: '5%', // 调整位置
                                    animation: 'cloudMove 10s linear infinite alternate',
                                },
                                children: "☁️"
                            }),
                            // 雨滴效果
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