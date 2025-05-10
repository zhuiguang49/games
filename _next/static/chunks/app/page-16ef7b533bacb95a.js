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

      let i = (e, t, n_grid) => {
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
            "tiger" === n_grid[i_r][r_c].content
          )
            return !0;
        }
        return !1;
      };

      r = () => {
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
                  fireEndTime: undefined, // 新增：用于火焰效果
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
          isRaining: !1, // 新增：是否正在下雨的状态
          lastPlantConsumedByHumansCount: 0, // 新增：用于精确控制“每2人消耗1植物”
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

        // 统一更新游戏状态，并重新计算氧气等衍生数据
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
              // 仅在实际值改变时更新，避免不必要的重渲染触发useEffect
              if (prev.plantCount !== newPlantCount ||
                  prev.humanCount !== newHumanCountForDisplay ||
                  prev.tigerCount !== newTigerCount ||
                  prev.woodCount !== newWoodCount ||
                  prev.oxygenLevel !== finalOxygen ||
                  JSON.stringify(prev.grid) !== JSON.stringify(newGrid) || // 简单比较grid
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
          [gameState.currentLevel] // 依赖 currentLevel 更新
        );


        // 处理火焰效果（烧死老虎）
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
                                // updateGridAndStats 会在 handleCellClick 末尾调用，这里只返回结果
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
                            gridCopyForDeath[r_idx][c_idx].owner = null; // 人死了，房子空了
                            // 不将 content 改为 human-dead，房子还在
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
                    // 规则4的普适性：只放入动物或人会死掉
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

        // 尸体腐烂的 useEffect
        (0, l.useEffect)(() => {
            const decayTimers = [];
            gameState.grid.flat().forEach((cell) => {
            if ( (cell.content === "human-dead" || cell.content === "tiger-dead") && cell.isDecaying ) {
                const timerId = setTimeout(() => {
                setGameState(prev => {
                    const newGrid = prev.grid.map((r, rIndex) => r.map((c, cIndex) => {
                        if (rIndex === Math.floor(cell.id / 4) && cIndex === (cell.id % 4)) {
                            if (c.isDecaying && (c.content === "human-dead" || c.content === "tiger-dead")) {
                                addMessage(`一具${c.content === "human-dead" ? "骸骨" : "老虎残骸"}风化消失了。`);
                                return {...c, content: null, isDecaying: false };
                            }
                        }
                        return c;
                    }));
                    // 检查grid是否真的改变了，如果改变了才调用updateGridAndStats
                    if (JSON.stringify(newGrid) !== JSON.stringify(prev.grid)) {
                         updateGridAndStats(newGrid);
                         return {...prev, grid: newGrid};
                    }
                    return prev;
                });
                }, 3000); // 假设3秒腐烂
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


        // 第三关倒计时和洪水
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

            setTimeout(() => {
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
                updateGridAndStats(newGridAfterFlood, "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。");
                setGameState((gs) => ({
                ...gs,
                isRaining: false,
                }));
            }, 3000);
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

            if (selectedItem) {
            if (null === clickedCell.content || ("ash" === clickedCell.content && "plant" === selectedItem)) {
                if ("plant" === selectedItem) {
                clickedCell.content = "plant";
                clickedCell.isFertile = ("ash" === clickedCell.content) || clickedCell.isFertile;
                message = "放置了植物";
                gridReallyChanged = true;
                } else if ("human" === selectedItem) {
                clickedCell.content = "human";
                message = "放置了人";
                if (i(row_idx, col_idx, gridCopy)) message += ", 附近有老虎威胁。";
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
            if (i(row_idx, col_idx, gridCopy) && gameState.currentLevel >= 2) {
                clickedCell.content = "fire";
                clickedCell.fireEndTime = Date.now() + 10000;
                message = "植物在老虎的威胁下被点燃了！";
                gridReallyChanged = true;
            } else if (gameState.currentLevel >= 2 && gameState.currentLevel !==3 && clickedCell.isFertile) { // 不是第三关或者第三关的肥沃土地
                clickedCell.content = "wood";
                message = "植物变成了木头！收集4块木头可以建造房子。";
                gridReallyChanged = true;
            } else if (gameState.currentLevel === 3 && !clickedCell.isFertile) {
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
                let finalMessage = message;

                // 1. Tiger eating logic
                if (gameState.currentLevel >= 2) {
                    let tigerEatsHumanThisTurn = false;
                    for (let r_tg = 0; r_tg < 5; r_tg++) {
                        for (let c_tg = 0; c_tg < 4; c_tg++) {
                            if (tempGrid[r_tg][c_tg].content === "tiger") {
                                let humanEatenInLoop = false;
                                for (let [dr_tg, dc_tg] of [ [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1] ]) {
                                    let h_r = r_tg + dr_tg, h_c = c_tg + dc_tg;
                                    if (h_r >= 0 && h_r < 5 && h_c >= 0 && h_c < 4) {
                                        let targetCell = tempGrid[h_r][h_c];
                                        if (targetCell.content === "human" && targetCell.owner !== "human") {
                                            tempGrid[h_r][h_c].content = "human-dead";
                                            tempGrid[h_r][h_c].isDecaying = true;
                                            finalMessage += ` 老虎在(${r_tg + 1},${c_tg + 1})吃掉了(${h_r + 1},${h_c + 1})的人！`;
                                            tigerEatsHumanThisTurn = true;
                                            humanEatenInLoop = true;
                                            break;
                                        }
                                    }
                                }
                                if (humanEatenInLoop) break;
                            }
                        }
                        if (tigerEatsHumanThisTurn) break;
                    }
                }

                // 2. Fire damage to tigers (based on potentially updated grid from tiger eating)
                const { updatedGrid: gridAfterFire, message: fireMessage } = applyFireDamageToTigers(tempGrid);
                if (fireMessage) {
                    finalMessage = (finalMessage ? finalMessage + " " : "") + fireMessage;
                }
                tempGrid = gridAfterFire;


                // 3. Human consumption of plants
                let finalHumansForPlantConsumption = 0;
                tempGrid.flat().forEach(cell => {
                    if (cell.content === "human" || cell.owner === "human") finalHumansForPlantConsumption++;
                });

                // Check if it's time to consume a plant
                // This logic ensures a plant is consumed for every two *new* net humans since the last consumption.
                let plantsToConsume = Math.floor(finalHumansForPlantConsumption / 2) - Math.floor(gameState.lastPlantConsumedByHumansCount / 2) ;

                if (plantsToConsume > 0) {
                    let plantsAvailable = [];
                    tempGrid.forEach((row, r_idx) => row.forEach((cell, c_idx) => {
                        if (cell.content === "plant") plantsAvailable.push({ r: r_idx, c: c_idx });
                    }));

                    for (let k = 0; k < plantsToConsume; k++) {
                        if (plantsAvailable.length > 0) {
                            const plantToRemoveIndex = Math.floor(Math.random() * plantsAvailable.length);
                            const plantToRemove = plantsAvailable.splice(plantToRemoveIndex, 1)[0]; // remove from available
                            tempGrid[plantToRemove.r][plantToRemove.c].content = null;
                            finalMessage = (finalMessage ? finalMessage + " " : "") + "由于人类增多，消耗了一株植物。";
                        } else {
                            finalMessage = (finalMessage ? finalMessage + " " : "") + "人类增多，但没有足够的植物可消耗。";
                            break; // No more plants to consume
                        }
                    }
                     if (plantsToConsume > 0) {
                         setGameState(prev => ({ ...prev, lastPlantConsumedByHumansCount: finalHumansForPlantConsumption - (finalHumansForPlantConsumption % 2) }));
                     }
                }


                if (finalMessage && finalMessage !== message) { // if messages were added
                     addMessage(finalMessage);
                } else if (message) { // if only the initial click message exists
                     addMessage(message);
                }
                updateGridAndStats(tempGrid);

            } else if (message) { // Grid didn't change but there's a message
                addMessage(message);
            }
        };


        const getCellIcon = (cell) =>
            cell.content === "plant"
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

        const getCellStyle = (cell) => {
            let backgroundColor = "#D2B48C"; // Default soil
            if (cell.content === "fire") backgroundColor = "#ffcc80"; // Fire
            else if (cell.content === "ash") backgroundColor = "#A0A0A0"; // Ash - slightly darker grey
            else if (gameState.currentLevel === 3 && !cell.isFertile && cell.content !== "house") backgroundColor = "#E0C9A6"; // Infertile land in level 3 (but not under a house)
            else if (cell.isFertile && cell.content !== "house") backgroundColor = "#B8860B"; // Fertile land - darkGoldenRod

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
                position: "relative",
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
                    children: ["当前关卡：", gameState.currentLevel],
                    }),
                    3 === gameState.currentLevel &&
                    (0, o.jsxs)("h3", {
                        style: timerDisplayStyle,
                        children: ["倒计时: ", gameState.timeLeft, "s"],
                    }),
                    (0, o.jsx)("div", {
                    style: {
                        display: "grid",
                        gridTemplateColumns: `repeat(4, 80px)`,
                        gridTemplateRows: `repeat(5, 80px)`,
                        gap: "5px",
                        border: "2px solid #a5d6a7",
                        margin: "20px auto",
                        backgroundColor: "#c8e6c9",
                        borderRadius: "8px",
                        padding: "5px",
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
                    style: {
                        textAlign: "center",
                        marginTop: "20px",
                        flexShrink: 0,
                    },
                    children: [
                        (0, o.jsx)("button", {
                        onClick: () => {
                            if (history.length > 0) {
                            const previousState = history[history.length - 1];
                            setGameState(previousState); // 这会恢复包括氧气在内的所有状态
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
                            updateGridAndStats(newGrid); // 重置 grid 并自动计算氧气 (应为0)
                            setGameState((prev) => ({
                                ...prev, // 保留 grid 和 oxygen 等从 updateGridAndStats 更新的值
                                currentLevel: nextLevel,
                                timeLeft: 120,
                                isGameOver: !1,
                                isRaining: false, // 重置下雨状态
                                messages: [`欢迎来到关卡 ${nextLevel}`],
                                lastPlantConsumedByHumansCount: 0, // 重置计数器
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
                    (0, o.jsx)("h3", { style: headerStyle, children: "可选生物/物品:" }),
                    (0, o.jsx)("div", {
                    style: { marginBottom: "15px", flexShrink: 0 },
                    children: [
                        { name: "plant", label: "植物 🌿" },
                        { name: "human", label: "人 🧑" },
                        ...(gameState.currentLevel >= 2 ? [{ name: "tiger", label: "老虎 🐅" }] : []),
                    ].filter(item => !(item.name === 'tiger' && gameState.currentLevel === 1)) // 第一关不显示老虎
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
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            pointerEvents: 'none', overflow: 'hidden',
                        },
                        children: Array(50).fill(null).map((_, idx) => (
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