

const topics=['Javascript programming']
export function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * topics.length);
    console.log(randomIndex)
    return topics[randomIndex];
  }

 