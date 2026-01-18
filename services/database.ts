import * as SQLite from 'expo-sqlite';

export interface FavoritePokemon {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async initDatabase(): Promise<void> {
    if (this.db) {
      return;
    }

    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          this.db = await SQLite.openDatabaseAsync('pokedex.db');
          await this.createTables();
        } catch (error) {
          throw error;
        }
      })();
    }

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      await this.initDatabase();
    }

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return this.db;
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async addFavorite(pokemonId: number, name: string, imageUrl?: string): Promise<void> {
    const db = await this.getDb();

    try {
      await db.runAsync(
        'INSERT OR REPLACE INTO favorites (id, name, image_url) VALUES (?, ?, ?)',
        [pokemonId, name, imageUrl || '']
      );
    } catch (error) {
      throw error;
    }
  }

  async removeFavorite(pokemonId: number): Promise<void> {
    const db = await this.getDb();

    try {
      await db.runAsync('DELETE FROM favorites WHERE id = ?', [pokemonId]);
    } catch (error) {
      throw error;
    }
  }

  async isFavorite(pokemonId: number): Promise<boolean> {
    const db = await this.getDb();

    try {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM favorites WHERE id = ?',
        [pokemonId]
      );
      return (result?.count || 0) > 0;
    } catch (error) {
      throw error;
    }
  }

  async getAllFavorites(): Promise<FavoritePokemon[]> {
    const db = await this.getDb();

    try {
      const result = await db.getAllAsync<FavoritePokemon>(
        'SELECT * FROM favorites ORDER BY created_at DESC'
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
