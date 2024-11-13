import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { Genre } from '@prisma/client';
import { prisma } from '../src/database';
import { app } from '../src';

describe('API Testleri', () => {
  let authToken: string;
  let testUserId: number;

  beforeAll(async () => {
    await prisma.rate.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.rate.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('Kimlik Doğrulama Endpointleri', () => {
    const testUser = {
      email: 'ferhataydin4407@gmail.com',
      password: '123456'
    };

    it('yeni bir kullanıcı kaydı yapmalı', async () => {
      const res = await app.request('/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.email).toBe(testUser.email);

      expect(data.data.token).toBeDefined();

      authToken = data.data.token;
      testUserId = data.data.id;
    });

    it('mevcut kullanıcı girişi yapmalı', async () => {
      const res = await app.request('/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.email).toBe(testUser.email);

      expect(data.data.token).toBeDefined();
    });
  });

  describe('Kitap Endpointleri', () => {
    let testBookId: number;

    const testBook = {
      title: "Yalnızlığın Ortasında",
      description: "Modern İstanbul'da geçen bu roman, yalnızlık ve toplumsal baskılar arasında sıkışmış bir kadının kendini bulma hikayesini anlatıyor. Derinlikli karakterler ve etkileyici atmosferiyle dikkat çekiyor.",
      released_at: new Date(),
      genre: Genre.FICTION
    };

    it('yeni bir kitap oluşturmalı', async () => {
      const res = await app.request('/book', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testBook)
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.title).toBe(testBook.title);

      expect(data.data.author.id).toBe(testUserId);

      testBookId = data.data.id;
    });

    it('tüm kitapları getirmeli', async () => {
      const res = await app.request('/book', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(Array.isArray(data.data.books)).toBeTruthy();

      expect(data.data.books.length).toBeGreaterThan(0);
    });

    it('kitapları türe göre filtrelemeli', async () => {
      const res = await app.request('/book?genre=FICTION', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(Array.isArray(data.data.books)).toBeTruthy();

      data.data.books.forEach((book: any) => {
        expect(book.genre).toBe('FICTION');
      });

    });

    it('kitapları puana göre sıralamalı', async () => {
      const res = await app.request('/book?sort_by_rating=desc', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(Array.isArray(data.data.books)).toBeTruthy();
      
      const ratings = data.data.books.map((book: any) => book.averageRating);
      const sortedRatings = [...ratings].sort((a, b) => b - a);

      expect(ratings).toEqual(sortedRatings);
    });

    it('belirli bir kitabı getirmeli', async () => {
      const res = await app.request(`/book/${testBookId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.title).toBe(testBook.title);
    });

    it('bir kitap için kullanıcı puanı oluşturmalı', async () => {
      const ratingData = {
        rate: 5
      };

      const res = await app.request(`/book/${testBookId}/rate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ratingData)
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.book.id).toBe(testBookId);

      expect(data.data.rate).toBe(ratingData.rate);
    });

    it('bir kitabın kullanıcı puanı güncellemeli', async () => {
      const updatedRating = {
        rate: 4
      };

      const res = await app.request(`/book/${testBookId}/rate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRating)
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.value).toBe(updatedRating.rate);

      expect(data.data.book.id).toBe(testBookId);

      expect(data.data.author).toBeDefined();
    });

    it('bir kitabın kullanıcı puanı getirmeli', async () => {
      const res = await app.request(`/book/${testBookId}/rate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data).toBeDefined();

      expect(data.data.book.id).toBe(testBookId);

      expect(data.data.author).toBeDefined();
    });

    it('bir kitabın kullanıcı puanı silmeli', async () => {
      const res = await app.request(`/book/${testBookId}/rate`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.book.id).toBe(testBookId);

      expect(data.data.author).toBeDefined();

      const checkRes = await app.request(`/book/${testBookId}/rate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const checkData = await checkRes.json();

      expect(checkData.data).toBeNull();
    });

    it('bir kitabı güncellemeli', async () => {
      const updateData = {
        title: 'Updated Test Book'
      };

      const res = await app.request(`/book/${testBookId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();

      expect(data.data.title).toBe(updateData.title);
    });

    it('bir kitabı silmeli', async () => {
      const res = await app.request(`/book/${testBookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      expect(res.status).toBe(200);

      expect(data.ok).toBeTruthy();
      
      expect(data.data.id).toBe(testBookId);
    });
  });
});