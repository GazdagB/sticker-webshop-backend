import supertest from "supertest";
import app from '../server.js';

export const mockedBody = {
    name: 'Unexpected Error on Line 32',
    price: 4.99,
    description: 'A quirky programming sticker for your laptop',
    image_url: 'https://picsum.photos/id/237/200/300',
    category_id: 1
  };

  export async function seedProduct(){
    const response = await supertest(app).post('/products').send(mockedBody);    
    return response;
  }

  export async function deleteProduct(id){
    await supertest(app).delete(`/products/${id}`)
  }