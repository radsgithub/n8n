const { Client } = require('pg');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const DB_CONFIG = {
    user: 'postgres',
    host: 'localhost',
    database: 'n8n',
    password: 'postgres',
    port: 5432,
};


async function main() {
    const client = new Client(DB_CONFIG);
    await client.connect();

    const res = await client.query('SELECT extra_fields FROM "user" WHERE extra_fields IS NOT NULL');

    const fieldStats = {};
    res.rows.forEach(row => {
        const fields = row.extra_fields || {};
        for (let key in fields) {
            fieldStats[key] = fieldStats[key] || new Set();
            fieldStats[key].add(typeof fields[key]);
        }
    });

    const choices = Object.keys(fieldStats).map(key => {
        const types = Array.from(fieldStats[key]).join(', ');
        return { name: `${key} (${types})`, value: key };
    });

    const { selectedFields } = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedFields',
            message: 'Select fields to promote:',
            choices,
        },
    ]);

    const generateType = (type) => {
        if (type === 'number') return 'number';
        if (type === 'boolean') return 'boolean';
        return 'string';
    };

    let dtoContent = '';
    let entityContent = '';

    selectedFields.forEach((key) => {
        const types = Array.from(fieldStats[key]);
        const fieldType = generateType(types[0]); // Choose first type
        dtoContent += `  ${key}?: ${fieldType};\n`;
        entityContent += `  @Column({ nullable: true })\n  ${key}?: ${fieldType};\n\n`;
    });
    const entityPathEntity = path.join(__dirname, 'users', 'user.entity.ts');
    const entityPathDto = path.join(__dirname, 'users', 'user.dto.ts');

    fs.appendFileSync(entityPathEntity, `\n// Auto-generated fields:\n${entityContent}`);
    fs.appendFileSync(entityPathDto, `\n// Auto-generated fields:\n${dtoContent}`);

    console.log('✅ DTO and Entity files updated!');
    await client.end();
}

main().catch(err => {
    console.error('❌ Error:', err);
});
