

const topics=['Javascript programming','Data Structures','HTML',]
export function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * topics.length);
    console.log(randomIndex)
    return topics[randomIndex];
  }

 