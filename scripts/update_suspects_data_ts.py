import json

with open('data/demo/synthetic_nagpur_suspects_5000.json', 'r', encoding='utf-8') as f:
    profiles = json.load(f)

first_25 = profiles[:25]

with open('src/lib/data/suspects-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = 'export const BASE_INDIAN_SUSPECTS: SuspectRecord[] = ['
end_marker = 'export const SUSPECTS_DATA'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    raise Exception(f"Markers not found: start={start_idx}, end={end_idx}")

new_block = start_marker + '\n'
for item in first_25:
    new_block += '  ' + json.dumps(item, indent=2).replace('\n', '\n  ') + ',\n'
new_block += '];\n\n'

new_content = content[:start_idx] + new_block + content[end_idx:]

with open('src/lib/data/suspects-data.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated BASE_INDIAN_SUSPECTS in src/lib/data/suspects-data.ts!")
