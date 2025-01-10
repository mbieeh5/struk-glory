export interface DataRes {
    NoNota: string;
    NamaUser: string;
    NoHpUser: string;
    TglMasuk: string;
    TglKeluar: string;
    MerkHp: string;
    Kerusakan: string;
    Keluhan: string;
    Penerima: string;
    Harga: any;
    Teknisi: string;
    sparepart: SparepartInterface[];
    Imei: any;
    Lokasi: string;
    status: string;
  }

  export interface SparepartInterface {
    Sparepart: string;
    HargaSparepart: string;
    TypeOrColor: string;
    Garansi? : string;
  }