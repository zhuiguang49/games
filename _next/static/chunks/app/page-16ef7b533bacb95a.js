// page-16ef7b533bacb95a.js
"use strict";
Object.defineProperty(t, "__esModule", { value: !0 });
n.d(t, { default: () => r });
var o = n(2860),
  l = n(3200);

// 检查老虎威胁的函数 (保持不变)
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
    Array(5) // 5行
      .fill(null)
      .map((_, r_idx) =>
        Array(4) // 4列
          .fill(null)
          .map((_, c_idx) => ({
            id: 4 * r_idx + c_idx,
            content: null, // plant, human, tiger, fire, wood, house, ash, human-dead, tiger-dead
            isFertile: !0, // 土地是否肥沃
            owner: null, // 主要用于标记房子里是否有人
            isDecaying: !1, // 用于标记尸体是否正在腐烂
            fireEndTime: undefined, // 火焰熄灭的时间戳
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
    timeLeft: 120, // 第三关倒计时
    messages: ["欢迎来到生态保护游戏！"],
    isGameOver: !1,
    isRaining: !1, // 新增：是否正在下雨的状态
    lastPlantConsumedByHumansCount: 0, // 新增：记录上次因人类数量消耗植物时的人类数量
  });

  const [selectedItem, setSelectedItem] = (0, l.useState)(null);
  const [history, setHistory] = (0, l.useState)([]);
  const [selectedWoods, setSelectedWoods] = (0, l.useState)([]);

  const addMessage = (0, l.useCallback)((messageText) => {
    setGameState((currentGameState) => ({
      ...currentGameState,
      messages: [...currentGameState.messages.slice(-5), messageText], // 保留最近6条消息
    }));
  }, []);

  // 统一更新游戏状态，并重新计算氧气等衍生数据
  const updateGameStateAndOxygen = (0, l.useCallback)((newGrid, customMessage) => {
    let newPlantCount = 0;
    let newHumanCountForDisplay = 0; // 用于UI显示格子中的人数
    let newTigerCount = 0;
    let newWoodCount = 0;
    let activeHumansForOxygen = 0; // 实际参与耗氧的人数（包括房子里的）
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

    // 确保氧气在0-100之间
    const finalOxygen = Math.max(0, Math.min(100, calculatedOxygen));

    setGameState((prev) => ({
      ...prev,
      grid: newGrid,
      oxygenLevel: finalOxygen,
      plantCount: newPlantCount,
      humanCount: newHumanCountForDisplay,
      tigerCount: newTigerCount,
      woodCount: newWoodCount,
      messages: customMessage ? [...prev.messages.slice(-5), customMessage] : prev.messages,
    }));
  }, [gameState.currentLevel]); // 依赖 currentLevel 以在计算氧气时区分贫瘠土地

  // 处理火焰熄灭和老虎被火烧死的逻辑
  const handleFireLogic = (0, l.useCallback)((currentGrid) => {
    let newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
    let messageLog = "";
    let fireCount = 0;
    let firePositions = [];

    newGrid.flat().forEach(cell => {
      if (cell.content === "fire") {
        fireCount++;
        firePositions.push({r: Math.floor(cell.id / 4), c: cell.id % 4});
      }
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
              newGrid[r_idx][c_idx].isDecaying = !0;
              messageLog += " 两团火的热量消灭了一只老虎！";
              // 老虎死亡，人数不变，氧气变化由 updateGameStateAndOxygen 统一处理
              break; // 假设一次只处理一只老虎
            }
          }
        }
        if (messageLog.includes("老虎")) break;
      }
    }
    return { updatedGrid: newGrid, message: messageLog };
  }, []);


  // 死亡判断的 useEffect
  (0, l.useEffect)(() => {
    let gridCopyForDeath = gameState.grid.map((row) => row.map((cell) => ({ ...cell })));
    let deathMessages = [];
    let gridChangedDueToDeath = false;
    const currentOxygen = gameState.oxygenLevel;

    gridCopyForDeath.forEach((row, r_idx) => {
      row.forEach((cell, c_idx) => {
        const isHumanInHouse = cell.owner === "human" && cell.content === "house";
        const isHumanOutside = cell.content === "human" && cell.owner !== "human";

        if (isHumanInHouse || isHumanOutside) {
          if (currentOxygen < 20) {
            deathMessages.push(`${isHumanInHouse ? "房子里的" : ""}人类因氧气浓度低于20%窒息而亡！`);
            if (isHumanInHouse) gridCopyForDeath[r_idx][c_idx].owner = null; // 人死了，房子空了
            else gridCopyForDeath[r_idx][c_idx].content = "human-dead";
            gridCopyForDeath[r_idx][c_idx].isDecaying = isHumanOutside; // 房子里的人死了不腐烂在房子里
            gridChangedDueToDeath = true;
          } else if (currentOxygen > 30) {
            deathMessages.push(`${isHumanInHouse ? "房子里的" : ""}人类因氧气浓度高于30%死亡！`);
            if (isHumanInHouse) gridCopyForDeath[r_idx][c_idx].owner = null;
            else gridCopyForDeath[r_idx][c_idx].content = "human-dead";
            gridCopyForDeath[r_idx][c_idx].isDecaying = isHumanOutside;
            gridChangedDueToDeath = true;
          }
        } else if (cell.content === "tiger" && currentOxygen <= 0 && gameState.plantCount === 0) {
          // 规则4：只放入动物或人会死掉，环境中无氧气，生物窒息而亡
          // 扩展到老虎
          deathMessages.push("老虎因环境中无氧气而窒息死亡！");
          gridCopyForDeath[r_idx][c_idx].content = "tiger-dead";
          gridCopyForDeath[r_idx][c_idx].isDecaying = true;
          gridChangedDueToDeath = true;
        }
      });
    });

    deathMessages.forEach(addMessage);

    if (gridChangedDueToDeath) {
      updateGameStateAndOxygen(gridCopyForDeath);
    }
  }, [gameState.oxygenLevel, gameState.grid, addMessage, updateGameStateAndOxygen]);

  // 尸体腐烂的 useEffect
  (0, l.useEffect)(() => {
    const decayTimers = [];
    let needsGridUpdateForDecay = false;
    let gridAfterDecay = gameState.grid.map(row => row.map(cell => ({...cell})));

    gameState.grid.flat().forEach((cell) => {
      if ( (cell.content === "human-dead" || cell.content === "tiger-dead") && cell.isDecaying ) {
        const timerId = setTimeout(() => {
          setGameState(prev => {
            const newGrid = prev.grid.map(r => r.map(c => ({...c})));
            const targetCell = newGrid[Math.floor(cell.id / 4)][cell.id % 4];
            if (targetCell && targetCell.isDecaying && (targetCell.content === "human-dead" || targetCell.content === "tiger-dead")) {
              targetCell.content = null;
              targetCell.isDecaying = false;
              addMessage(`一具${targetCell.content === "human-dead" ? "骸骨" : "老虎残骸"}风化消失了。`);
              // 腐烂不直接影响氧气，但会改变格子内容，所以需要重新评估
              updateGameStateAndOxygen(newGrid); // 让 updateGameStateAndOxygen 重新计算
              return {...prev, grid: newGrid}; // 确保返回新的状态
            }
            return prev;
          });
        }, 3000); // 假设3秒腐烂
        decayTimers.push(timerId);
      }
    });
    return () => decayTimers.forEach(clearTimeout);
  }, [gameState.grid, addMessage, updateGameStateAndOxygen]);


  // 火焰熄灭的 useEffect
  (0, l.useEffect)(() => {
    const fireTimers = [];
    let gridChangedByFireOut = false;
    let gridAfterFireOut = gameState.grid.map(row => row.map(cell => ({ ...cell })));

    gameState.grid.flat().forEach((cell) => {
      if (cell.content === "fire" && cell.fireEndTime && Date.now() >= cell.fireEndTime) {
        const r = Math.floor(cell.id / 4);
        const c = cell.id % 4;
        gridAfterFireOut[r][c].content = "ash";
        gridAfterFireOut[r][c].isFertile = true; // 灰烬是肥沃的
        gridAfterFireOut[r][c].fireEndTime = undefined;
        gridChangedByFireOut = true;
        addMessage("火焰熄灭了，留下了一片肥沃的草木灰土地。");
      }
    });

    if (gridChangedByFireOut) {
      updateGameStateAndOxygen(gridAfterFireOut);
    }
    // 注意：这里不需要清除定时器，因为我们是比较 Date.now() 和 fireEndTime
  }, [gameState.grid, addMessage, updateGameStateAndOxygen]);


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
      !gameState.isRaining // 确保只触发一次
    ) {
      addMessage("120秒到！持续强降雨，引发大洪水！");
      setGameState((gs) => ({ ...gs, isRaining: true })); // 开始下雨

      setTimeout(() => {
        let newGridAfterFlood = gameState.grid.map((row) =>
          row.map((cell) => {
            let tempCell = { ...cell };
            if (tempCell.content === "fire") {
              tempCell.content = "ash"; // 火被雨浇灭
              tempCell.isFertile = true;
              tempCell.fireEndTime = undefined;
            } else if (tempCell.content !== "ash") { // 草木灰除外
              tempCell.content = null;
              tempCell.owner = null;
              tempCell.isFertile = false; // 其他土地变贫瘠
            }
            tempCell.isDecaying = false;
            return tempCell;
          }),
        );
        updateGameStateAndOxygen(newGridAfterFlood, "洪水退去。部分土地因草木灰而肥沃，其余土地贫瘠。"); // 让它重新计算氧气
        setGameState((gs) => ({
          ...gs,
          isRaining: false, // 雨停了
          // woodCount: 0, // 已在 updateGameStateAndOxygen 中处理
        }));
      }, 3000); // 3秒后洪水结束
    }
    return () => clearInterval(interval_id);
  }, [gameState.currentLevel, gameState.timeLeft, gameState.isGameOver, gameState.isRaining, addMessage, updateGameStateAndOxygen, gameState.grid]);


  const saveHistory = () => {
    setHistory((prevHistory) => [
      ...prevHistory.slice(-19), // 保留最近20条历史记录，避免内存问题
      JSON.parse(JSON.stringify(gameState)),
    ]);
  };

  const selectItem = (itemName) => {
    setSelectedItem(itemName);
    setSelectedWoods([]);
    addMessage(`选择了 ${itemName === "plant" ? "植物" : itemName === "human" ? "人" : "老虎"}`);
  };

  const handleCellClick = (row_idx, col_idx) => {
    saveHistory();
    let gridCopy = gameState.grid.map((row) => row.map((cell) => ({ ...cell })));
    let clickedCell = gridCopy[row_idx][col_idx];
    let message = "";
    let gridReallyChanged = false; // 标记网格内容是否真的因为这次点击而改变

    if (selectedItem) {
      if (null === clickedCell.content || ("ash" === clickedCell.content && "plant" === selectedItem)) {
        if ("plant" === selectedItem) {
          clickedCell.content = "plant";
          clickedCell.isFertile = ("ash" === clickedCell.content) || clickedCell.isFertile; // 灰烬地种植物也是肥沃的
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
      if (i(row_idx, col_idx, gridCopy) && gameState.currentLevel >= 2) { // 只有第二关及以后，老虎威胁下点燃
        clickedCell.content = "fire";
        clickedCell.fireEndTime = Date.now() + 10000; // 火持续10秒
        message = "植物在老虎的威胁下被点燃了！";
        gridReallyChanged = true;
      } else if (gameState.currentLevel >= 2) {
        clickedCell.content = "wood";
        message = "植物变成了木头！收集4块木头可以建造房子。";
        gridReallyChanged = true;
      } else if (gameState.currentLevel === 3 && !clickedCell.isFertile) {
        // 第三关，点击贫瘠土地上的植物可以变成火来肥沃土地
        clickedCell.content = "fire";
        clickedCell.fireEndTime = Date.now() + 10000;
        clickedCell.isFertile = true; // 点燃后土地会变肥沃（通过灰烬）
        message = "植物燃烧成草木灰可以增加土壤肥力。";
        gridReallyChanged = true;
      }
      else {
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
                gridCopy[r_house][c_house].isFertile = true; // 房子下的地认为是可用的
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

    // 处理老虎吃人
    if (gameState.currentLevel >= 2 && gridReallyChanged) { // 只有在格子内容发生改变后才检查老虎吃人
      let gridForTigerCheck = gridCopy.map(row => row.map(cell => ({ ...cell })));
      let tigerEatsHumanThisTurn = false;
      let originalHumanCount = 0;
      gridForTigerCheck.flat().forEach(cell => {
        if(cell.content === "human" || cell.owner === "human") originalHumanCount++;
      });

      for (let r_tg = 0; r_tg < 5; r_tg++) {
        for (let c_tg = 0; c_tg < 4; c_tg++) {
          if (gridForTigerCheck[r_tg][c_tg].content === "tiger") {
            let humanEatenInLoop = false;
            for (let [dr_tg, dc_tg] of [
              [-1, 0], [1, 0], [0, -1], [0, 1],
              [-1, -1], [-1, 1], [1, -1], [1, 1],
            ]) {
              let h_r = r_tg + dr_tg, h_c = c_tg + dc_tg;
              if (h_r >= 0 && h_r < 5 && h_c >= 0 && h_c < 4) {
                let targetCell = gridForTigerCheck[h_r][h_c];
                // 老虎只吃格子里的，不吃房子里的
                if (targetCell.content === "human" && targetCell.owner !== "human") {
                  gridForTigerCheck[h_r][h_c].content = "human-dead";
                  gridForTigerCheck[h_r][h_c].isDecaying = true;
                  message += ` 老虎在(${r_tg + 1},${c_tg + 1})吃掉了(${h_r + 1},${h_c + 1})的人！`;
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
      if (tigerEatsHumanThisTurn) {
        gridCopy = gridForTigerCheck; // 如果老虎吃了人，使用这个更新后的grid
      }
    }

    // 处理火焰效果 (需要在老虎吃人之后，因为老虎可能被烧死)
    if (gridReallyChanged || message.includes("老虎")) { // 如果格子变了，或者有老虎相关的消息（可能老虎被烧）
        const { updatedGrid: gridAfterFire, message: fireMessage } = handleFireLogic(gridCopy);
        if (fireMessage) {
            message = (message ? message + " " : "") + fireMessage;
        }
        gridCopy = gridAfterFire;
    }


    // 处理人类数量增多消耗植物 (在所有格子内容最终确定后)
    let finalHumansForPlantConsumption = 0;
    gridCopy.flat().forEach(cell => {
        if(cell.content === "human" || cell.owner === "human") finalHumansForPlantConsumption++;
    });

    if (finalHumansForPlantConsumption > gameState.lastPlantConsumedByHumansCount &&
        finalHumansForPlantConsumption > 0 &&
        finalHumansForPlantConsumption % 2 === 0) {
        let plantsAvailable = [];
        gridCopy.forEach((row, r_idx) => row.forEach((cell, c_idx) => {
            if (cell.content === "plant") plantsAvailable.push({r: r_idx, c: c_idx});
        }));

        if (plantsAvailable.length > 0) {
            const plantToRemove = plantsAvailable[Math.floor(Math.random() * plantsAvailable.length)];
            gridCopy[plantToRemove.r][plantToRemove.c].content = null;
            message = (message ? message + " " : "") + "由于人类增多，消耗了一株植物。";
            setGameState(prev => ({...prev, lastPlantConsumedByHumansCount: finalHumansForPlantConsumption}));
            gridReallyChanged = true; // 确保状态更新
        } else {
            message = (message ? message + " " : "") + "人类增多，但没有植物可消耗。";
        }
    }


    if (message) {
      addMessage(message);
    }

    if (gridReallyChanged) {
      updateGameStateAndOxygen(gridCopy);
    }
  };


  const getCellIcon = (cell) =>
    cell.content === "plant"
      ? "\uD83C\uDF3F" // 🌿
      : cell.content === "plant-dead" // 假设你有这个状态
        ? "\uD83C\uDF42" // 🍂
        : cell.content === "human"
          ? "\uD83E\uDDD1" // 🧑
          : cell.content === "human-dead"
            ? "\uD83D\uDC80" // 💀
            : cell.content === "tiger"
              ? "\uD83D\uDC05" // 🐅
              : cell.content === "tiger-dead"
                ? "☠️" // 区分一下老虎死
                : cell.content === "fire"
                  ? "\uD83D\uDD25" // 🔥
                  : cell.content === "wood"
                    ? selectedWoods.includes(cell.id)
                      ? "\uD83E\uDEB5✨" // 🪵✨ (带选中效果)
                      : "\uD83E\uDEB5" // 🪵
                    : cell.content === "house"
                      ? cell.owner === "human"
                        ? "\uD83C\uDFE0\uD83E\uDDD1" // 🏠🧑
                        : "\uD83C\uDFE0" // 🏠
                      : cell.content === "ash"
                        ? "\uD83E\uDEA8" // 灰烬 🪨 (暂用石头代替，你可以找更合适的)
                        : "";

  const getCellStyle = (cell) => {
    let backgroundColor = "#D2B48C"; // 默认土壤
    if (cell.content === "fire") backgroundColor = "#ffcc80"; // 火焰
    else if (cell.content === "ash" || cell.isFertile) backgroundColor = "#A9A9A9"; // 灰烬或肥沃土地
    else if (!cell.isFertile && gameState.currentLevel === 3) backgroundColor = "#E0C9A6"; // 第三关贫瘠土地

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

  // --- 按钮和文本样式 (保持不变) ---
  let buttonStyle_v = { /* ... */ };
  let textStyle_C = { /* ... */ };
  let headerStyle_w = { /* ... */ };
  let timerStyle_L = { /* ... */ };
   timerStyle_L = {
    textAlign: "center",
    color:
      gameState.timeLeft < 10 ? "red" : gameState.timeLeft < 60 ? "#f57c00" : "black",
    marginTop: "0",
    marginBottom: "10px",
    flexShrink: 0,
  };
   buttonStyle_v = {
    padding: "10px 15px",
    fontSize: "1em",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    margin: "5px",
  };
   textStyle_C = {
    margin: "5px 0",
    fontSize: "0.9em",
    color: "black",
  };
   headerStyle_w = {
    color: "black",
    marginTop: "15px",
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
        position: "relative", // 为下雨效果定位
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
                style: timerStyle_L,
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
                    onClick: () => handleCellClick(Math.floor(cell.id / 4), cell.id % 4),
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
                      setGameState(previousState);
                      setHistory(history.slice(0, -1));
                      setSelectedItem(null);
                      setSelectedWoods([]);
                      addMessage("操作已撤销");
                    }
                  },
                  style: buttonStyle_v,
                  children: "撤销",
                }),
                (0, o.jsx)("button", {
                  onClick: () => {
                    saveHistory();
                    let nextLevel = gameState.currentLevel < 3 ? gameState.currentLevel + 1 : 1; // 改为1可以循环
                    addMessage(gameState.currentLevel === 3 && nextLevel === 1 ? "重新开始第一关" : `进入关卡 ${nextLevel}`);
                    const newGrid = initialGrid();
                    updateGameStateAndOxygen(newGrid); // 这会自动将氧气等重置
                    setGameState((prev) => ({
                      ...prev, // 保留 updateGameStateAndOxygen 更新的内容
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
                  style: { ...buttonStyle_v, marginLeft: "10px" },
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
            (0, o.jsx)("h3", { style: headerStyle_w, children: "可选生物/物品:" }),
            (0, o.jsx)("div", {
              style: { marginBottom: "15px", flexShrink: 0 },
              children: [
                { name: "plant", label: "植物 🌿" },
                { name: "human", label: "人 🧑" },
                ...(gameState.currentLevel >= 2 ? [{ name: "tiger", label: "老虎 🐅" }] : []),
              ].map((item) =>
                (0, o.jsx)(
                  "button",
                  {
                    onClick: () => selectItem(item.name),
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
            (0, o.jsx)("h3", { style: headerStyle_w, children: "状态显示:" }),
            (0, o.jsxs)("div", {
              style: { marginBottom: "10px", flexShrink: 0 },
              children: [
                (0, o.jsxs)("p", { style: textStyle_C, children: ["氧气浓度: ", gameState.oxygenLevel, "%"] }),
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
            (0, o.jsxs)("p", { style: textStyle_C, children: ["植物数量: ", gameState.plantCount, " 🌿"] }),
            (0, o.jsxs)("p", { style: textStyle_C, children: ["人类数量: ", gameState.humanCount, " 🧑"] }),
            (0, o.jsxs)("p", { style: textStyle_C, children: ["老虎数量: ", gameState.tigerCount, " 🐅"] }),
            (0, o.jsxs)("p", { style: textStyle_C, children: ["木头数量: ", gameState.woodCount, " 🪵"] }),
            (0, o.jsx)("h3", { style: headerStyle_w, children: "信息提示:" }),
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
        // 下雨效果的覆盖层
        gameState.isRaining && gameState.currentLevel === 3 && (
            (0, o.jsx)("div", {
                style: {
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(70, 100, 150, 0.4)', // 更深的雨幕颜色
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    overflow: 'hidden', // 防止雨滴溢出
                },
                children: // 简易雨滴效果 (可以用更复杂的CSS动画或SVG代替)
                    Array(50).fill(null).map((_, idx) => (
                        (0, o.jsx)("div", {
                            style: {
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                width: '2px',
                                height: `${10 + Math.random() * 10}px`,
                                backgroundColor: 'lightblue',
                                animation: `fall ${0.5 + Math.random() * 0.5}s linear infinite`,
                                top: `${-20 - Math.random() * 30}px`, // 从屏幕外开始
                                animationDelay: `${Math.random() * 2}s`,
                            }
                        }, `drop-${idx}`)
                    ))
            })
        ),
        // CSS for rain (可以放在 <style jsx> 或外部CSS中)
        // 这里用内联方式简化
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