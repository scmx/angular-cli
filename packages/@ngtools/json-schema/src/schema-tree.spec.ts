import {readFileSync} from 'fs';
import {join} from 'path';

import {RootSchemaTreeNode} from './schema-tree';


describe('@ngtools/json-schema', () => {

  describe('OneOfSchemaTreeNode', () => {
    const schemaJsonFilePath = join(__dirname, '../tests/schema1.json');
    const schemaJson = JSON.parse(readFileSync(schemaJsonFilePath, 'utf-8'));
    const valueJsonFilePath = join(__dirname, '../tests/value1-1.json');
    const valueJson = JSON.parse(readFileSync(valueJsonFilePath, 'utf-8'));


    it('works', () => {
      const proto: any = Object.create(null);
      new RootSchemaTreeNode(proto, {
        value: valueJson,
        schema: schemaJson
      });

      expect(proto.oneOfKey2 instanceof Array).toBe(true);
      expect(proto.oneOfKey2.length).toBe(2);

      // Set it to a string, which is valid.
      proto.oneOfKey2 = 'hello';
      expect(proto.oneOfKey2 instanceof Array).toBe(false);
    });

    it('returns undefined for values that are non-existent', () => {
      const proto: any = Object.create(null);
      const root = new RootSchemaTreeNode(proto, { value: valueJson, schema: schemaJson });

      const value = root.children['objectKey1'].children['objectKey'].children['stringKey'].get();
      expect(value).toBe(undefined);
    });
  });


  describe('EnumSchemaTreeNode', () => {
    const schemaJsonFilePath = join(__dirname, '../tests/schema2.json');
    const schemaJson = JSON.parse(readFileSync(schemaJsonFilePath, 'utf-8'));
    const valueJsonFilePath = join(__dirname, '../tests/value2-1.json');
    const valueJson = JSON.parse(readFileSync(valueJsonFilePath, 'utf-8'));


    it('works', () => {
      const proto: any = Object.create(null);
      new RootSchemaTreeNode(proto, {
        value: valueJson,
        schema: schemaJson
      });

      expect(proto.a instanceof Array).toBe(true);
      expect(proto.a).toEqual([null, 'v1', null, 'v3']);

      // Set it to a string, which is valid.
      proto.a[0] = 'v2';
      proto.a[1] = 'INVALID';
      expect(proto.a).toEqual(['v2', null, null, 'v3']);
    });

    it('supports default values', () => {
      const proto: any = Object.create(null);
      const schema = new RootSchemaTreeNode(proto, {
        value: valueJson,
        schema: schemaJson
      });

      expect(schema.children['b'].get()).toEqual('default');
    });
  });

});
