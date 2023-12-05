// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const API_KEY = '059d4d43924e6201598cb467ae4620dc';

export async function getData(location: string) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`);
  const data = await response.json();
  return { data: data };
}

export async function getHourlyData(location: string) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`);
  const data = await response.json();
  return { data: data };
}