'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDatabase, ref, child, get } from "firebase/database";
import { app } from '../../../firebase';
import { DataRes } from '../../../types';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



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
            const datas = snapshot.val();
            setData(datas);
          } else {
            console.error("No data available");
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [isClient, noNota]);

  const saveAsPDF = async () => {
    const element = document.getElementById('invoice');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'cm', 'a4', false);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 1.5;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${noNota}.pdf`);
    }
  };

  const shareInvoice = () => {
    const shareData = {
      title: 'Invoice',
      text: 'Here is your invoice',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.error('Invoice shared successfully'))
        .catch((error) => console.error('Error sharing invoice:', error));
    } else {
      console.error('Sharing not supported in this browser');
    }
  };

  if (!isClient || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>

      <InvoiceWrapper id="invoice">
        <Header>
          <Title>Invoice</Title>
          <InvoiceInfo>
            <p>No Nota: {data.NoNota}</p>
            <p>TGL Masuk: {data.TglMasuk.split('T')[0]}</p>
            <p>TGL Keluar: {data.TglKeluar && data.TglKeluar !== "null" ? data.TglKeluar.split('T')[0] : 'belum di ambil'}</p>
          </InvoiceInfo>
        </Header>
        <CompanyInfo>
          <p><strong>Glory Cell</strong></p>
          <p>IG: <a href='https://instagram.com/glorycell.official' target='_blank'>Glorycell.official</a></p>
          <a href='https://maps.app.goo.gl/eBGqugQ2p1ZT3h8F9' target='_blank'><p>Jln Raya Cikaret no 002B-C Harapan Jaya</p>
          <p> Kec Cibinong, kab Bogor, Jawabarat</p></a>
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
              <th>Merk HP</th>
              <th>Perbaikan</th>
              <th>Imei</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.MerkHp}</td>
              <td>{data.Kerusakan}</td>
              <td>{data.Imei ? data.Imei : 0}</td>
              <td>{parseInt(data.Harga).toLocaleString('id')}</td>
            </tr>
          </tbody>
        </Table>
          <p>Kerusakan: {data.Keluhan ? data.Keluhan : " "}</p>
        </TableContainer>
        <TermsAndConditions>
        </TermsAndConditions> 
        <Footer>
          <p>Dilayani: {data.Penerima}</p>
          <p><strong>Teknisi: {data.Teknisi}</strong></p>
          <p>Lokasi Service: GloryCell {data.Lokasi}</p>
          <p>Status: <strong>{data.status === 'sudah diambil' ? 'SUKSES' : data.status}</strong></p>
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
            <li>Garansi Baterai berlaku 30 hari, untuk pebaikan Lain Lain Garansi 7 hari Dan <strong>Software tidak bergaransi</strong></li>
            <li>Klaim garansi wajib menyertakan bukti pembayaran berupa nota transaksi perbaikan.</li>
            <li>Pelanggan yang tidak dapat menunjukkan struk atau nota fisik, maka dapat menunjukkannya melalui link ini.</li>
            <li>Pelanggan yang kehilangan nota dan tidak memiliki bukti foto/link dari kami, akan tetap dilayani proses klaimnya selama nota perbaikan dapat dilakukan tracking untuk dicetak kembali.</li>            <li>Nota pelanggan yang tidak dapat dilakukan tracking, maka tidak dapat dilayani proses klaim garansinya.</li>
            <li>Pelanggan yang mengalami kendala pada devicenya dapat mengonfirmasi terlebih dahulu keluhannya ke nomer whatsapp 08999081100 jika tidak dapat datang ke store di waktu tersebut.</li>
            <li>Garansi tidak berlaku pada item di luar perbaikan dari nota transaksi.</li>
            <li>Pelanggan diperkenankan melakukan klaim garansi maksimal sebanyak 3 (tiga) kali selama masa periode garansi.</li>
            <li>Garansi tidak berlaku apabila terjadi indikasi human error (kelalaian peng-gunaan) seperti terjatuh, terhempas, tertekan, kena air, overcharging, dan disebabkan penggunaan charger yang cacat/tidak wajar.</li>
            <li>Segala kerusakan FUNGSIONAL (Camera, Layar Eror, Speaker, Mic, Charge, Dll) yang di temukan dan data yang hilang setelah selesai perbaikan untuk unit yang masuk dalam keadaan NO CHECK (Mati Total, Blank, No Touch, Stuck Logo, Disabled), adalah DILUAR TANGGUNG JAWAB GloryCell.</li>
            <li>Garansi tidak berlaku jika diketahui terjadi pembongkaran device di luar GloryCell, segel rusak atau hilang.</li>
          </ol>
          <h3>Persyaratan Khusus</h3>
          <ol>
            <li>Garansi Service Mesin hanya berlaku sesuai dengan kendala awal kerusakan dan berada pada Jalur IC yang sama.</li>
            <li>Garansi LCD/Touchscreen yang berlaku jika kondisi fisik LCD seperti baru dan hanya kendala pada LCD Blank Hitam, Touchscreen Error, bergaris sehelai, Black Spot dan White Spot (Faktor Pemasangan)</li>
            <li>Garansi LCD tidak berlaku apabila terjadi kerusakan pada fisik LCD mengalami Gores (Baret)/Retak/Pecah Luar dan tampilan LCD Bergaris atau Black Spot.</li>
            <li>Garansi Baterai tidak berlaku apabila terjadi indikasi over-charging, baterai menggelembung.</li>
            <li>Pergantian Housing, Backdoor, dan Kaca Kamera hanya berupa Garansi Pemasangan di hari yang sama.</li>
            <li>Barang yang tidak di ambil selama 14 Hari, hilang / rusak bukan merupakan tanggung jawab dari GloryCell.</li>
            <li>Maksimal pengambilan device inap 14 Hari setelah konfirmasi pengambilan unit kepada customer, apabila dalam waktu tersebut tidak ada pengambilan device maka device akan dikirim ke Kantor Pusat.</li>
            <li>Apabila dalam waktu 30 hari masih tidak ada pengambilan device inap, maka device customer bukan lagi tanggung jawab dari GloryCell.</li>
          </ol>
        </TermsAndConditions>
      </InvoiceWrapper>
      <ButtonContainer>
        <Button onClick={() => saveAsPDF()} >Simpan Invoice</Button>
        <Button onClick={() => shareInvoice()}>Bagikan Invoice</Button>
    </ButtonContainer>
    </>
  );
};
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding-top: 1rem;
`;

const Button = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const InvoiceWrapper = styled.div`
  max-width: 100%;
  max-height: 100%;
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