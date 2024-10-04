const personalGradient = "linear-gradient(135deg, #f600c1 0%, #fdeb25 100%)";

// Constants for the user-icon gradients
const colors = {
  0: "#01f7f7",
  1: "#00eca5",
  2: "#f7b801",
  3: "#d90855",
  4: "#55d911",
  5: "#1333c0",
  6: "#ff00e6",
  7: "#fffc4c",
}

const angles = {
  0: "135deg",
  1: "225deg",
  3: "45deg",
  2: "315deg",
  4: "60deg",
}

let gradientTracker = [];

// Gradient Generator
// Generates and keeps track of the gradients for each 'registered' user
const generateGradient = (inputNickname) => {

  // If the user already has a gradient stored, we return it
  if(gradientTracker.find(el => el.nickname === inputNickname)){
    let userGradientObj = gradientTracker.find(el => el.nickname === inputNickname);
    return `linear-gradient(${angles[userGradientObj.angleIx]}, #762aa8 0%, ${colors[userGradientObj.colorIx]} 100%)`;
  }

  // If the user does not have a gradient stored, we start the process of generating a new one
  let angleObj = gradientTracker.reduce((acc, curr) => { // First we need to find the next color angle and available colors to use based on activity in the chatrooms
    let angleIxObj = acc.find(el => el.angleIx == curr.angleIx);
    if(angleIxObj){
        angleIxObj.colorIxs.push(curr.colorIx);
    }else{
        acc.push({
            angleIx: curr.angleIx,
            colorIxs: [curr.colorIx]
        })
    }
    return acc;
  }, []).sort((a, b) => a.angleIx - b.angleIx).find(el => el.colorIxs.length < 8);

  // Once we find the 'lowest' angle index with available colors, we generate a new gradient from said colors
  if(angleObj){
    let availableColors = Object.keys(colors).filter(color => !angleObj.colorIxs.includes(parseInt(color)));
    let randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    let grad = `linear-gradient(${angles[angleObj.angleIx]}, #762aa8 0%, ${colors[parseInt(randomColor)]} 100%)`;
  
    // Create a new object for the nickname, color and angle index
    const newGrad = {
      nickname: inputNickname,
      colorIx: parseInt(randomColor),
      angleIx: angleObj.angleIx,
    }
    gradientTracker.push(newGrad);
    return grad
  }
  // If all angles and colors all full, or none present at all, we generate a new angle and color
  else{
    let newAngleIx = Math.floor(gradientTracker.length / 8);

    if (newAngleIx > 4) { // Edge case where we have a lot of users in the room
      newAngleIx = newAngleIx % 4;
    }

    let colorIx = Math.floor(Math.random() * 8);
    const newGrad = {
      nickname: inputNickname,
      colorIx: colorIx,
      angleIx: newAngleIx,
    }
    gradientTracker.push(newGrad);
    return `linear-gradient(${angles[newAngleIx]}, #762aa8 0%, ${colors[colorIx]} 100%)`;
  }
}
