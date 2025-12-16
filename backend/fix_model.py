import h5py
import json

def recursive_clean(config):
    """
    Fungsi rekursif buat ngebersihin dictionary config dari keyword 'haram'
    di TensorFlow 2.10.
    """
    if isinstance(config, dict):
        # 1. Hapus 'synchronized' (Penyebab error lu sekarang)
        if 'synchronized' in config:
            print(f"   ✂️ Removing 'synchronized' param...")
            del config['synchronized']
            
        # 2. Fix 'batch_shape' (Masalah pertama tadi)
        if 'batch_shape' in config:
            print(f"   🔧 Renaming 'batch_shape' -> 'batch_input_shape'...")
            config['batch_input_shape'] = config.pop('batch_shape')

        # 3. Fix 'DTypePolicy' (Masalah kedua tadi)
        if 'dtype' in config and isinstance(config['dtype'], dict):
             if 'module' in config['dtype'] and 'keras' in config['dtype']['module']:
                 # Sederhanakan policy jadi string 'float32' biasa biar aman
                 print(f"   🛡️ Downgrading DTypePolicy...")
                 config['dtype'] = 'float32'

        # Lanjut cek ke anak-anaknya
        for key, value in config.items():
            recursive_clean(value)
            
    elif isinstance(config, list):
        for item in config:
            recursive_clean(item)

filename = "model.h5"

try:
    print(f"🚑 Memulai Operasi Penyelamatan {filename}...")
    f = h5py.File(filename, mode="r+")
    
    # Ambil config
    model_config_str = f.attrs.get("model_config")
    if isinstance(model_config_str, bytes):
        model_config_str = model_config_str.decode('utf-8')
    
    # Load sebagai JSON object (Bukan string mentah lagi)
    model_config_json = json.loads(model_config_str)
    
    # JALANKAN PEMBERSIHAN
    recursive_clean(model_config_json)
    
    # Encode balik ke string JSON
    new_config_str = json.dumps(model_config_json)
    
    # Save balik ke file
    f.attrs.modify("model_config", new_config_str)
    
    print("✅ OPERASI SUKSES: Semua parameter 'zaman now' udah dihapus.")
    f.close()

except Exception as e:
    print(f"❌ Error: {e}")