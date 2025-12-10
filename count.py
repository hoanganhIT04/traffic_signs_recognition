# update_counts_smart.py (đọc số lượng ảnh trong từng folder và cập nhật vào CSV tương ứng)
import os
import shutil
import unicodedata
import pandas as pd
from pathlib import Path

# ====== cấu hình ======
csv_path = Path(r"A:\Thực tập chuyên môn I\traffic-signs-recognition\bien_bao_giao_thong.csv")
data_root = Path(r"A:\Thực tập chuyên môn I\traffic-signs-recognition\data")
# =======================

IMG_EXTS = {'.png', '.jpg', '.jpeg', '.bmp', '.tif', '.tiff', '.gif'}

def normalize_text(s: str) -> str:
    """Chuẩn hoá: strip, lowercase, remove BOM, remove diacritics, collapse spaces."""
    if s is None:
        return ""
    s = str(s).strip()
    s = s.lstrip('\ufeff')  # remove BOM if any
    # unicode normalize then remove diacritics
    nfkd = unicodedata.normalize('NFKD', s)
    no_diacritics = ''.join(ch for ch in nfkd if not unicodedata.combining(ch))
    # collapse whitespace, lowercase
    return ' '.join(no_diacritics.split()).lower()

def build_folder_map(root: Path):
    """Tạo map: normalized_folder_name -> list of actual folder names (to handle duplicates)."""
    mapping = {}
    if not root.exists() or not root.is_dir():
        return mapping
    for entry in root.iterdir():
        if entry.is_dir():
            norm = normalize_text(entry.name)
            mapping.setdefault(norm, []).append(entry.name)
    return mapping

def count_images_in_dir(path: Path):
    c = 0
    for root, dirs, files in os.walk(path):
        for f in files:
            if Path(f).suffix.lower() in IMG_EXTS:
                c += 1
    return c

# --- đọc CSV và xác định cột chứa mã ---
df = pd.read_csv(csv_path, dtype=str)
# chuẩn hóa tên cột: strip, remove BOM at start, lowercase
orig_columns = df.columns.tolist()
norm_cols = [c.strip().lstrip('\ufeff').lower() for c in orig_columns]
col_map = dict(zip(norm_cols, orig_columns))  # map normalized -> original name
# tìm cột mã (ưu tiên)
candidates = ['mã','ma','code','label','id','m']
label_col_norm = None
for cand in candidates:
    if cand in col_map:
        label_col_norm = cand
        break

if label_col_norm is None:
    print("❌ Không tự động tìm thấy cột mã trong CSV. Các cột hiện có:")
    for i,c in enumerate(orig_columns,1):
        print(f"  {i}. '{c}'")
    raise SystemExit("Hãy đổi tên cột chứa mã thành 'Mã' hoặc 'label' hoặc 'code'...")

label_col = col_map[label_col_norm]  # original column name to use
print(f"✅ Dùng cột '{label_col}' làm cột chứa mã để đối chiếu.")

# thêm cột 'số lượng' nếu chưa có (giữ nguyên tên gốc 'số lượng' nếu xuất hiện khác dạng, nhưng ta đặt chuẩn)
if "số lượng" not in df.columns:
    df["số lượng"] = ""

# build folder map once
folder_map = build_folder_map(data_root)
# also prepare a list of folder normalized names for fuzzy search
folder_norm_keys = set(folder_map.keys())

not_found = []
updated = 0

for idx, row in df.iterrows():
    raw_label = row[label_col]
    norm_label = normalize_text(raw_label)

    found_folder_name = None

    # 1) exact normalized match
    if norm_label in folder_map:
        # take first actual folder (if multiple actual folder names map to same normalized key)
        found_folder_name = folder_map[norm_label][0]
    else:
        # 2) try more liberal matching: try remove dots, replace spaces, etc.
        trials = set()
        trials.add(norm_label.replace('.', ''))               # remove dots
        trials.add(norm_label.replace(' ', ''))               # remove spaces
        trials.add(norm_label.replace('.', '').replace(' ', ''))
        trials.add(norm_label.replace('_', ' '))
        # try these trials
        for t in trials:
            if t in folder_map:
                found_folder_name = folder_map[t][0]
                break

    if found_folder_name:
        folder_path = data_root / found_folder_name
        cnt = count_images_in_dir(folder_path)
        df.at[idx, "số lượng"] = cnt
        updated += 1
    else:
        df.at[idx, "số lượng"] = "Không tìm thấy"
        not_found.append((raw_label, norm_label))

# lưu backup bằng copy (an toàn nếu file đang mở)
backup_path = csv_path.with_suffix(csv_path.suffix + ".bak.csv")
shutil.copy(csv_path, backup_path)
df.to_csv(csv_path, index=False, encoding="utf-8-sig")

# báo cáo
print(f"\n✅ Hoàn tất. Đã cập nhật {updated} dòng trong '{csv_path.name}'.")
print(f"💾 Bản gốc được sao lưu tại: {backup_path}")
if not_found:
    print(f"\n❗ Có {len(not_found)} mã không tìm thấy folder tương ứng. Ví dụ:")
    for i, (raw, norm) in enumerate(not_found[:20], 1):
        print(f"  {i}. '{raw}' -> normalized '{norm}'")
    print("\nBạn có thể kiểm tra các mã trên và tên folder trong thư mục data để tìm nguyên nhân (khoảng trắng, ký tự lạ, dấu BOM, khác ký tự).")
else:
    print("👍 Tất cả mã đều tìm thấy folder tương ứng.")
