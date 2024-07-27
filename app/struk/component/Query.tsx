'use client'
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getDatabase, ref, child, get } from "firebase/database";
import { app } from '../../../firebase';
import { DataRes } from '../../../types';
import styled from 'styled-components';



export default function Query(){
    const  SearchParam  = useSearchParams();
    const noNota = SearchParam.get('noNota') || "x";
    const [data, setData] = useState<DataRes | null>(null);
    const [isClient, setIsClient] = useState<Boolean>(false);

  useEffect(() => {
    setIsClient(true);
}, []);

useEffect(() => {
    const isValidNoNota = (noNota: string | string[] | undefined): boolean => {
        if (typeof noNota === 'string') {
          const regex = /^[a-zA-Z0-9]+$/;
          return regex.test(noNota);
        }
        return false;
      };
    if (isClient && isValidNoNota(noNota || "")) {
      const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef =   ref(db);
        try {
          const snapshot = await get(child(dbRef, `Service/sandboxDS/${noNota}`));
          if (snapshot.exists()) {
            setData(snapshot.val());
            console.log(snapshot.val())
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [isClient, noNota]);

  if (!isClient || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <InvoiceWrapper>
        <Header>
          <Title>Invoice</Title>
          <InvoiceInfo>
            <p>No Nota: {data.NoNota}</p>
            <p>TGL Masuk: {data.TglMasuk.split('T')[0]}</p>
            <p>TGL Keluar: {data.TglKeluar.split('T')[0]}</p>
          </InvoiceInfo>
        </Header>
        <CompanyInfo>
          <p><strong>Glory Cell</strong></p>
          <p>Jln Raya Cikaret no 002B-C Harapan Jaya</p>
          <p> Kec Cibinong, kab Bogor, Jawabarat</p>
          <p>Telepon: 08999081100</p>
        </CompanyInfo>
        <CustomerInfo>
        <p><strong>Informasi Pelanggan</strong></p>
          <p>Nama  : {data.NamaUser}</p>
          <p>No HP: {data.NoHpUser}</p>
        </CustomerInfo>
        <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Deskripsi</th>
              <th>Merk HP</th>
              <th>Kerusakan</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Penerima: {data.Penerima}</td>
              <td>{data.MerkHp}</td>
              <td>{data.Kerusakan}</td>
              <td>{parseInt(data.Harga).toLocaleString('id')}</td>
            </tr>
          </tbody>
        </Table>
        </TableContainer>
        
        <Footer>
          <p><strong>Teknisi: {data.Teknisi}</strong></p>
          <p>Lokasi Service: GloryCell {data.Lokasi}</p>
          <p>Status: <strong>{data.status.toLocaleUpperCase()}</strong></p>
        </Footer>
        <TermsAndConditions>
          <h2>Syarat Ketentuan Service</h2>
            <ol>
                <li>Customer telah melakukan pengecekan fungsional dan SETUJU dengan kondisi unit yang di terima</li>
                <li>Adapun kerusakan di luar dari servis yang tertera di invoice tidak dapat di claim dan ataupun Refund diluar dari perbaikan pertama.</li>
                <li>Ketentuan claim garansi dapat di baca dibawah ini untuk pengajuan claim garansi.</li>
            </ol>
          <h2>Ketentuan Garansi</h2>
          <h3>Persyaratan Umum</h3>
          <ol>
            <li>Klaim garansi wajib menyertakan bukti pembayaran berupa nota transaksi perbaikan.</li>
            <li>Pelanggan yang tidak dapat menunjukkan struk atau nota fisik, maka dapat menunjukkannya melalui link ini.</li>
            <li>Pelanggan yang kehilangan nota dan tidak memiliki bukti foto/link dari kami, akan tetap dilayani proses klaimnya dengan ketentuan membawa KTP asli dan wajib difoto oleh kami.</li>
            <li>Nota pelanggan yang tidak dapat dilakukan tracking, maka tidak dapat dilayani proses klaim garansinya.</li>
            <li>Pelanggan yang mengalami kendala pada devicenya dapat mengonfirmasi terlebih dahulu keluhannya ke nomer whatsapp 08999081100 jika tidak dapat datang ke store di waktu tersebut.</li>
            <li>Garansi tidak berlaku pada item di luar perbaikan dari nota transaksi.</li>
            <li>Pelanggan diperkenankan melakukan klaim garansi maksimal sebanyak 3 (tiga) kali selama masa periode garansi.</li>
            <li>Garansi tidak berlaku apabila terjadi indikasi human error (kelalaian peng-gunaan) seperti terjatuh, terhempas, tertekan, kena air, overcharging, dan disebabkan penggunaan charger yang cacat/tidak wajar.</li>
            <li>Segala kerusakan FUNGSIONAL ( kamera , keyboard dll ) yang di temukan dan data yang hilang setelah selesai perbaikan untuk unit yang masuk dalam keadaan NO CHECK (Mati Total, Blank, No Touch, Stuck Logo, Disabled), adalah DILUAR TANGGUNG JAWAB GloryCell.</li>
            <li>Garansi tidak berlaku jika diketahui terjadi pembongkaran device di luar GloryCell, segel rusak atau hilang.</li>
          </ol>
          <h3>Persyaratan Khusus</h3>
          <ol>
            <li>Garansi Service Mesin hanya berlaku sesuai dengan kendala awal kerusakan dan berada pada Jalur IC yang sama.</li>
            <li>Garansi LCD/Touchscreen yang berlaku jika kondisi fisik LCD seperti baru dan hanya kendala pada LCD Blank Hitam, Touchscreen Error, bergaris sehelai, Black Spot dan White Spot (Faktor Pemasangan)</li>
            <li>Garansi LCD tidak berlaku apabila terjadi kerusakan pada fisik LCD mengalami Gores (Baret)/Retak/Pecah Luar dan tampilan LCD Bergaris atau Black Spot.</li>
            <li>Garansi Baterai tidak berlaku apabila terjadi indikasi over-charging, baterai menggelembung, dan penurunan kesehatan baterai secara normal.</li>
            <li>Pergantian Housing, Backdoor, dan Kaca Kamera hanya berupa Garansi Pemasangan di hari yang sama.</li>
            <li>Barang yang tidak di ambil selama 14 Hari, hilang / rusak bukan merupakan tanggung jawab dari GloryCell.</li>
            <li>Maksimal pengambilan device inap 14 Hari setelah konfirmasi pengambilan unit kepada customer, apabila dalam waktu tersebut tidak ada pengambilan device maka device akan dikirim ke Kantor Pusat.</li>
            <li>Apabila dalam waktu 30 hari masih tidak ada pengambilan device inap, maka device customer bukan lagi tanggung jawab dari Icolor GloryCell.</li>
          </ol>
        </TermsAndConditions>
      </InvoiceWrapper>
    </>
  );
};

const InvoiceWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const InvoiceInfo = styled.div`
  text-align: right;
  p {
    margin: 0;
  }
`;

const CompanyInfo = styled.div`
  text-align: left;
  margin-bottom: 20px;
  p {
    margin: 0;
  }
`;

const CustomerInfo = styled.div`
  text-align: left;
  margin-bottom: 20px;
  p {
    margin: 0;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
`;

const Footer = styled.div`
  text-align: left;
  margin-top: 20px;
  p {
    margin: 5px 0;
  }
`;

const TermsAndConditions = styled.div`
  text-align: left;
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid #ddd;

  h2, h3 {
    margin-top: 0;
  }

  ol {
    padding-left: 20px;
  }

  li {
    margin-bottom: 10px;
  }
`;