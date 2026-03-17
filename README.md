# Tusmo – Dukumeenti Kooban (Af-Soomaali)

Tusmo waa luqad u eg C/Python oo leh naxwe fudud, turjumaad C ah, iyo maktabad ahaan Boehm GC. `tusmo.py` wuxuu u beddelaa `.tus` → C → binary isagoo isticmaalaya compiler la dhisay (zig) iyo runtime la raray.

## Rakibid degdeg ah
- Linux/macOS: `curl -fsSL https://raw.githubusercontent.com/tusmo-official/Tusmo/main/install.sh | bash`
- Windows (PowerShell): `iwr https://raw.githubusercontent.com/tusmo-official/Tusmo/main/install.ps1 -UseBasicParsing | iex`

Waxay soo dejisaa tusmo, runtime, GC, compiler (zig), stdlib, iyo VS Code extension (haddii `code/codium` la helo). macOS waa ARM64 kaliya. Windows/Linux waxay helaan asset-yada ku habboon.

## Sida loo ordo
```bash
tusmo file.tus        # soo saar oo orod binary-ga
tusmo file.tus --c    # kaliya soo saar .c, ha tirtirin
```
Compiler-ka iyo libgc-ga la raray ayaa loo isticmaalaa si toos ah (ama `TUSMO_CC`/`TUSMO_LIB_DIR`/`TUSMO_INCLUDE_DIR` haddii la beddelo).

## Imports (keen)
```tusmo
keen "mylib.tus";
keen "widgets/button.tus";
```
Raadinta: (1) folder-ka faylka hadda, (2) `.lib/`, (3) `lib/`, (4) `stdlib/`. Tani waxay kuu oggolaanaysaa maktabado qarsoon `.lib/` ama kuwa wadaag ah `lib/`.

## Naxwe aasaasi ah
### Doorsoomayaal
```tusmo
keyd:tiro a = 10;
keyd:jajab e = 3.14;
keyd:eray  s = "Hello";
keyd:xaraf c = 'A';
keyd:miyaa f = haa;   # ama maya
keyd:waxbo aan_wax;   # void/placeholder
```

### Isku darka iyo falalka
```tusmo
keyd:tiro n = 5 + 3 * 2;
keyd:miyaa cond = n > 5 ? haa : maya;   # ternary
```

### Qor & Hel (I/O)
```tusmo
qor("Hello Tusmo");
# hel waa interactive; tusaale: keyd:eray magac = hel("Magaca?");
```

### Hawlo (functions)
```tusmo
hawl salaam(m: eray) : waxbo { qor("Salaan " + m); }
shaqo isku(a: tiro, b: tiro) => tiro { soo_celi a + b; }

hawl lehDefault(n: tiro, msg: eray = "hi") : waxbo {
  qor(msg); qor(n);
}
```

### Loops
```tusmo
inta ay (i < 5) { qor(i); i = i + 1; }
samay { qor(i); i = i - 1; } inta ay (i > 0);
soco x laga bilaabo 0 .. 3 { qor(x); }
soco item kasta laga helo arr { qor(item); }
```

### Shuruudo
```tusmo
haddii (a > 10) { qor("weyn"); }
ama_haddii (a == 10) { qor("siman"); }
haddii_kale { qor("yar"); }
```

### Tix (arrays) iyo Qaamuus (dict)
```tusmo
keyd:tix:tiro arr = [1,2,3];
arr[0] = 10;
qor(arr);

keyd:qaamuus d = {"magac": "Ali", "da": 25};
d["da"] = 26;
qor(d);
```

### F-strings
```tusmo
keyd:eray magac = "Tusmo";
keyd:tiro da = 5;
qor($"Magac: {magac}, Da: {da}");
```

### Koodh C ku lifaaqan
```tusmo
___c__code_("int add_c(int a,int b){return a+b;}");
keyd:tiro n = ___c__call_("add_c", 2, 3);
qor(n);
```

### Koodh ururin iyo features
- Compiler: zig cc (bundled) ama `TUSMO_CC` haddii la beddelo.
- Lib GC: libgc (bundled). Env: `TUSMO_LIB_DIR`, `TUSMO_INCLUDE_DIR`.
- Features auto-linking: string, array, dictionary, os, time, http, socket, websocket, random, conversion.

## Tusaalooyin degdeg ah (ku saleysan `test/`)
- `test/variables.tus` – doorsoomayaal iyo noocyo.
- `test/functions.tus` – hawlo, defaults, soo_celi.
- `test/loops.tus`, `test/conditions.tus` – wareegyo iyo haddii.
- `test/arrays.tus`, `test/dictionaries.tus` – tix iyo qaamuus.
- `test/io.tus` – qor/hel, f-strings.

Orod tusaale: `tusmo test/variables.tus`.

## Maktabadaha
- Stdlib waxaa lagu keenaa `keen "nasiib.tus";` iwm., waxaana laga helaa `stdlib/` ee la raray.
- Maktabado gaar ah geli `.lib/` ama `lib/`, kadib `keen "foo.tus";`.

## LSP / Hover / Syntax
- VS Code extension (VSIX) ayaa la dhisaa oo lagu daray releases, installers-na waxay isku dayaan inay rakibaan haddii `code/codium` la helo.
- TextMate grammar (syntaxes/) ayaa ku jira Extension/ haddii aad rabto inaad u adeegsato tifaftirayaal kale.

## Xaddidaadyo hadda
- Namespace ma jiro: imports waxay galaan hal scope, ka fogow magac isku dhacyo.
- macOS Intel asset lama dhiso; adeegsiga ARM64 oo kaliya.
- OS-level icons (Finder/Explorer) lama dejiyo; icon-ka wuxuu ka muuqdaa VS Code oo keliya.

## Cillad sheegid
- Hubi in `tusmo` ku jiro PATH; haddii kale source `~/.tusmo/env.sh` (Linux/mac).
- Haddii `keen` helo 404, xaqiiji `.lib/`/`lib/`/`stdlib/` iyo magaca faylka (`.tus` waa la darayaa haddii la waayo).
