

const topics=['Javascript programming']
export function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * topics.length);
    
    return topics[randomIndex];
  }

 