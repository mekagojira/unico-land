# ORM System

This project uses a custom ORM (Object-Relational Mapping) system that provides database-agnostic operations. The ORM supports multiple database backends through adapter pattern.

## Architecture

```
BaseModel (Abstract)
  ├── User (extends BaseModel)
  ├── Content (extends BaseModel)
  └── ... (other models)

D1Adapter (implements database operations for D1/SQLite)
  └── Can be extended with MongoDBAdapter, PostgreSQLAdapter, etc.
```

## Features

- **Database Agnostic**: Switch between databases without changing model code
- **Type Safety**: Models are JavaScript classes with type checking
- **Automatic Timestamps**: `createdAt` and `updatedAt` are handled automatically
- **JSON Field Support**: Automatic serialization/deserialization of JSON fields
- **Query Builder**: Simple, intuitive query interface

## Usage

### Basic CRUD Operations

```javascript
import { User } from "../models/User.js";
import { getD1Client } from "../config/database.js";

const db = await getD1Client();

// Create
const user = await User.create(db, {
  username: "john",
  email: "john@example.com",
  password: "hashedPassword",
  role: "admin"
});

// Find one
const user = await User.findOne(db, { email: "john@example.com" });

// Find by ID
const user = await User.findById(db, "user-id");

// Find many
const users = await User.find(db, { role: "admin" }, {
  sort: { createdAt: -1 },
  limit: 10,
  skip: 0
});

// Update
user.username = "john_updated";
await user.save(db);

// Or update by ID
await User.findByIdAndUpdate(db, "user-id", { username: "john_updated" });

// Delete
await user.delete(db);

// Or delete by ID
await User.findByIdAndDelete(db, "user-id");

// Count
const count = await User.count(db, { role: "admin" });
```

### Custom Model Methods

Models can override base methods or add custom ones:

```javascript
// User model has custom findOne for $or queries
const user = await User.findOne(db, {
  $or: [
    { email: "john@example.com" },
    { username: "john" }
  ]
});

// Content model has findBySlug
const content = await Content.findBySlug(db, "my-article", "jp");
```

## Creating a New Model

1. Extend `BaseModel`:

```javascript
import { BaseModel } from "../orm/BaseModel.js";

export class MyModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    // Set defaults
    this.status = data.status || "active";
  }

  static getTableName() {
    return "my_table";
  }

  // Override toJSON if needed
  toJSON() {
    const obj = { ...this };
    delete obj.secretField;
    return obj;
  }
}
```

2. The model automatically gets:
   - `findOne(db, filter)`
   - `find(db, filter, options)`
   - `findById(db, id)`
   - `create(db, data)`
   - `save(db)`
   - `findByIdAndUpdate(db, id, update)`
   - `delete(db)`
   - `findByIdAndDelete(db, id)`
   - `count(db, filter)`

## Adding a New Database Adapter

To support a new database (e.g., MongoDB, PostgreSQL):

1. Create a new adapter in `adapters/`:

```javascript
// adapters/MongoDBAdapter.js
export class MongoDBAdapter {
  constructor(db) {
    this.db = db;
    this.collection = null;
  }

  async findOne(Model, filter) {
    const collection = this.db.collection(Model.getTableName());
    const doc = await collection.findOne(filter);
    return doc ? new Model(doc) : null;
  }

  async find(Model, filter = {}, options = {}) {
    const collection = this.db.collection(Model.getTableName());
    let query = collection.find(filter);
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.skip) {
      query = query.skip(options.skip);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const docs = await query.toArray();
    return docs.map(doc => new Model(doc));
  }

  // ... implement other methods
}
```

2. Update `BaseModel.getAdapter()` to detect and use the new adapter:

```javascript
static getAdapter(db) {
  if (!db) {
    throw new Error("Database connection is required");
  }

  // Detect database type
  if (db.constructor.name === "MongoClient") {
    const { MongoDBAdapter } = await import("./adapters/MongoDBAdapter.js");
    return new MongoDBAdapter(db);
  }

  // Default to D1
  return new D1Adapter(db);
}
```

## JSON Fields

Models with JSON fields (like `metadata`, `tags`) are automatically handled:

- **Reading**: JSON strings are parsed into objects/arrays
- **Writing**: Objects/arrays are stringified to JSON

Example:
```javascript
const content = await Content.create(db, {
  title: "My Article",
  metadata: { views: 100, likes: 50 }, // Automatically stringified
  tags: ["tech", "javascript"] // Automatically stringified
});

// When reading, they're automatically parsed back
console.log(content.metadata); // { views: 100, likes: 50 }
console.log(content.tags); // ["tech", "javascript"]
```

## Query Options

The `find()` method accepts an `options` object:

```javascript
{
  sort: { createdAt: -1 }, // -1 for DESC, 1 for ASC
  limit: 10,
  skip: 0
}
```

## Filter Operators

Currently supported:
- Simple equality: `{ role: "admin" }`
- Multiple conditions: `{ role: "admin", isActive: true }`
- `$or` operator: `{ $or: [{ email: "..." }, { username: "..." }] }`

More operators can be added to adapters as needed.

## Benefits

1. **Easy Database Migration**: Switch from D1 to MongoDB by just changing the adapter
2. **Consistent API**: Same methods work across all databases
3. **Type Safety**: Models are classes, not plain objects
4. **Extensible**: Easy to add new methods or override behavior
5. **Maintainable**: Database logic is centralized in adapters

## Future Enhancements

- [ ] Add more query operators (`$gt`, `$lt`, `$in`, etc.)
- [ ] Add relationships/population (e.g., `content.populate('author')`)
- [ ] Add validation hooks
- [ ] Add middleware/hooks (beforeSave, afterCreate, etc.)
- [ ] Add transactions support
- [ ] Add query builder for complex queries

