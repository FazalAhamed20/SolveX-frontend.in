

const topics=['Javascript programming','Data Structures','Typescript programming','HTML',]
export function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * topics.length);
    console.log(randomIndex)
    return topics[randomIndex];
  }

 