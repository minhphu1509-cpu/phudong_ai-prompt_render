import type { PromptItem } from '../types'

const architecture = [
  'Biệt thự hiện đại nhiệt đới','Nhà phố trên lô đất hẹp','Biệt thự tân cổ điển tiết chế',
  'Resort ven biển đương đại','Khách sạn đô thị ban đêm','Quán cà phê sân vườn',
  'Trường học xanh thân thiện','Cao ốc văn phòng mặt dựng kính','Trung tâm thương mại sôi động',
  'Trung tâm văn hóa bản địa','Nhà vườn Bắc Bộ đương đại','Homestay trên triền dốc Đà Lạt',
  'Nhà hàng ven sông','Trung tâm thể thao cộng đồng','Bảo tàng tối giản đơn khối',
  'Nhà máy công nghiệp hiện đại','Công trình tâm linh Việt Nam','Thư viện cộng đồng mở',
  'Chung cư xanh nhiều ban công','Quảng trường đô thị đa chức năng','Trạm nghỉ đường cao tốc',
  'Cải tạo nhà cũ thích ứng','Flycam khu phức hợp',
]

const interiors = [
  'Phòng khách Đông Dương đương đại','Bếp tối giản có đảo','Phòng ngủ khách sạn cao cấp',
  'Phòng tắm phong cách spa','Văn phòng mở linh hoạt','Sảnh khách sạn sang trọng',
  'Nhà hàng fine dining','Quán cà phê diện tích nhỏ','Showroom nội thất cao cấp',
  'Căn hộ studio thông minh','Phòng trẻ em trung tính','Thư viện tại gia',
  'Phòng họp lãnh đạo','Phòng trị liệu spa','Cửa hàng thời trang tối giản',
  'Phòng thờ hiện đại trang nghiêm','Bếp nhà hàng chuyên nghiệp','Không gian co-working sáng tạo',
  'Phòng gym hiện đại','Phòng trưng bày nghệ thuật','Phòng khách nhỏ thoáng sáng',
  'Phòng thay đồ walk-in','Vườn trong nhà và giếng trời',
]

const edits = [
  {
    title: 'Thay vật liệu chính xác theo vùng tô',
    description: 'Đổi vật liệu chỉ trong vùng mask và giữ toàn bộ phần còn lại.',
    prompt: 'Chỉnh sửa ảnh nguồn chỉ trong vùng màu {argument name="màu mask" default="đỏ"}: thay bằng vật liệu từ ảnh tham chiếu. Bám đúng phối cảnh, tỷ lệ viên, hướng lát, mạch ron, ánh sáng và phản xạ hiện hữu. Không thay geometry, camera, vật thể hay vùng ngoài mask; kết quả photorealistic, không watermark.',
  },
  {
    title: 'Xóa vật thể và phục hồi nền',
    description: 'Loại bỏ vật thể không mong muốn và tái tạo nền tự nhiên.',
    prompt: 'Xóa {argument name="vật thể" default="vật thể được đánh dấu"} khỏi ảnh nguồn. Phục hồi nền dựa trên đường nét, vật liệu, bóng đổ và phối cảnh lân cận; không thay vùng khác, không crop, không đổi camera hoặc ánh sáng. Kết quả sạch, liền mạch và chân thực.',
  },
  {
    title: 'Thay bầu trời đồng bộ ánh sáng',
    description: 'Đổi thời tiết và cân bằng ánh sáng hợp lý.',
    prompt: 'Thay bầu trời ảnh nguồn thành {argument name="bầu trời" default="trời xanh có mây nhẹ"}. Giữ nguyên kiến trúc và cảnh quan; đồng bộ nhiệt màu, bóng đổ, phản xạ kính và độ ẩm không khí. Không làm biến dạng đường biên mái, không HDR quá mức.',
  },
  {
    title: 'Ghép đồ vật từ ảnh tham chiếu',
    description: 'Chèn đồ vật đúng mẫu, tỷ lệ và phối cảnh.',
    prompt: 'Chèn vật thể từ ảnh tham chiếu vào vùng được chỉ định. Giữ chính xác hình dáng, màu và vật liệu của mẫu; khớp tỷ lệ, điểm tụ, tiêu cự, hướng sáng, bóng tiếp xúc và độ nét. Không sửa kiến trúc hoặc đồ vật khác, không tạo thêm biến thể.',
  },
  {
    title: 'Chuyển cảnh ban ngày sang blue hour',
    description: 'Biến đổi thời điểm nhưng giữ nguyên thiết kế.',
    prompt: 'Chuyển ảnh kiến trúc ban ngày sang blue hour. Giữ tuyệt đối hình khối, vật liệu, cây, người, xe và camera; tạo bầu trời xanh sâu, bật đèn nội thất có chọn lọc 3000K, đèn cảnh quan nhẹ và phản xạ hợp lý. Không thêm cửa hay nguồn sáng phi logic.',
  },
  {
    title: 'Nâng cấp phác thảo thành ảnh thực tế',
    description: 'Chuyển sketch hoặc screenshot 3D thành ảnh chân thực.',
    prompt: 'Chuyển ảnh phác thảo hoặc screenshot 3D thành ảnh kiến trúc photorealistic. Khóa hình khối, số tầng, tỷ lệ, hệ cửa, nội thất chính, địa hình và camera; xóa nét line nhưng giữ cạnh kiến trúc. Áp vật liệu {argument name="phong cách" default="hiện đại tối giản"}, ánh sáng tự nhiên và bối cảnh phù hợp, không redesign.',
  },
]

const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const base = (title: string, number: number, category: string, description: string, prompt: string): PromptItem => ({
  id: `studio-${slugify(title)}-${number}`, number, title, rawTitle: title, category, description, prompt,
  images: [], author: { name: 'PhuDong AI Studio', url: '' }, source: null,
  published: '14 tháng 7, 2026', language: 'vi', tryLink: '', featured: false, raycastFriendly: true,
})

const architecturePrompts = architecture.map((title, index) => base(
  title, 249 + index, 'Kiến trúc — Ngoại thất',
  `Tạo phối cảnh ${title.toLowerCase()} chân thực và bảo toàn thiết kế nguồn.`,
  `Chuyển ảnh nguồn thành phối cảnh ${title.toLowerCase()} chuyên nghiệp. Giữ nguyên tuyệt đối hình khối, số tầng, tỷ lệ mặt đứng, kết cấu, hệ cửa, mái, địa hình và góc camera. Hoàn thiện vật liệu PBR đúng tỷ lệ, bối cảnh {argument name="bối cảnh" default="Việt Nam hiện đại"}, ánh sáng {argument name="ánh sáng" default="ban ngày dịu"}, cây xanh và hoạt động vừa phải. Ống kính 28mm, đường đứng thẳng, photorealistic architectural photography, 16:9, không redesign, không đảo gương, không thêm tầng, không logo giả, không watermark.`,
))

const interiorPrompts = interiors.map((title, index) => base(
  title, 272 + index, 'Nội thất',
  `Diễn họa ${title.toLowerCase()} với vật liệu và ánh sáng chân thực.`,
  `Render ${title.toLowerCase()} từ ảnh hoặc mô hình nguồn. Khóa tường, trần, sàn, cửa, tỷ lệ, đồ nội thất chính và camera; không di chuyển công năng. Hoàn thiện vật liệu {argument name="vật liệu chủ đạo" default="gỗ tự nhiên và đá sáng"}, ánh sáng tự nhiên kết hợp đèn {argument name="nhiệt màu" default="3000K"}, phụ kiện tối thiểu đúng tỷ lệ. Ống kính 24mm, vertical lines thẳng, màu sắc biên tập nội thất cao cấp, photorealistic, không làm rộng sai thực tế, không logo giả, không watermark.`,
))

const editPrompts = edits.map((item, index) => base(item.title, 295 + index, 'Chỉnh sửa ảnh', item.description, item.prompt))

const architectureTypes = [
  'Nhà phố mặt tiền hẹp','Biệt thự sân vườn','Biệt thự nghỉ dưỡng ven biển','Nhà ở trên triền dốc','Chung cư cao tầng',
  'Khách sạn boutique','Resort sinh thái','Khu nghỉ dưỡng khoáng nóng','Cao ốc văn phòng','Trụ sở doanh nghiệp',
  'Trường học liên cấp','Thư viện cộng đồng','Bảo tàng nghệ thuật','Trung tâm văn hóa','Nhà hàng sân vườn',
  'Quán cà phê đô thị','Trung tâm thương mại','Nhà ga hành khách','Công trình tâm linh Việt Nam','Khu phức hợp đa chức năng',
]

const architectureDirections = [
  { name: 'Hiện đại nhiệt đới', material: 'bê tông trần, đá địa phương, gỗ ngoài trời và mảng xanh nhiệt đới', light: 'nắng sớm xiên nhẹ' },
  { name: 'Tối giản đương đại', material: 'vữa khoáng sáng, kính low-e, kim loại sơn mờ và chi tiết âm', light: 'ánh sáng ban ngày khuếch tán' },
  { name: 'Bản địa đương đại', material: 'gạch đất nung, đá tự nhiên, gỗ và cấu kiện thủ công địa phương', light: 'golden hour ấm dịu' },
  { name: 'Sinh thái bền vững', material: 'vật liệu tái tạo, lam chắn nắng, mái xanh và bề mặt thấm nước', light: 'trời quang sau mưa' },
  { name: 'Sang trọng tiết chế', material: 'đá sáng khổ lớn, kính trong, kim loại champagne và gỗ tối màu', light: 'blue hour kết hợp đèn kiến trúc 3000K' },
]

const interiorTypes = [
  'Phòng khách biệt thự','Phòng khách căn hộ','Bếp có đảo trung tâm','Phòng ăn gia đình','Phòng ngủ master',
  'Phòng ngủ trẻ em','Phòng tắm master','Phòng thay đồ walk-in','Phòng làm việc tại gia','Phòng sinh hoạt chung',
  'Sảnh khách sạn','Phòng khách sạn cao cấp','Nhà hàng fine dining','Quán cà phê nhỏ','Văn phòng mở',
  'Phòng họp lãnh đạo','Không gian co-working','Showroom nội thất','Cửa hàng thời trang','Spa trị liệu',
]

const interiorDirections = [
  { name: 'Modern Luxury', palette: 'đá sáng vân nhẹ, veneer gỗ tối, kim loại champagne và vải trung tính', light: 'ánh sáng tự nhiên cân bằng đèn 3000K' },
  { name: 'Japandi', palette: 'gỗ sồi sáng, vữa khoáng, vải linen và đồ thủ công tối giản', light: 'ánh sáng cửa sổ mềm và gián tiếp' },
  { name: 'Indochine đương đại', palette: 'gỗ nâu ấm, mây đan, gạch họa tiết tiết chế và màu xanh sâu', light: 'ánh sáng ấm phân lớp 2700K–3000K' },
  { name: 'Minimal Warm', palette: 'gỗ tự nhiên, travertine, vải bouclé và bảng màu kem ấm', light: 'ánh sáng khuếch tán không chói' },
  { name: 'Biophilic', palette: 'gỗ, đá nhám, cây xanh nội thất, vật liệu tự nhiên và màu đất', light: 'ánh sáng trời giàu chiều sâu kết hợp hắt khe' },
]

const newArchitecturePrompts = architectureTypes.flatMap((building, buildingIndex) => architectureDirections.map((direction, directionIndex) => {
  const number = 301 + buildingIndex * architectureDirections.length + directionIndex
  const title = `${building} — ${direction.name}`
  return base(
    title,
    number,
    'Kiến trúc — Thiết kế chuyên sâu',
    `Phát triển ý tưởng ${building.toLowerCase()} theo phong cách ${direction.name.toLowerCase()}, phù hợp khí hậu và bối cảnh Việt Nam.`,
    `Thiết kế ${building.toLowerCase()} theo phong cách ${direction.name}. Dữ liệu đầu vào gồm khu đất, công năng, hướng nắng và ảnh/mô hình nguồn. Giữ đúng ranh đất, cao độ, số tầng, diện tích và các yêu cầu công năng bắt buộc; tổ chức giao thông rõ ràng, thông gió chéo, che nắng hợp lý và tỷ lệ kiến trúc tinh tế. Ngôn ngữ vật liệu: ${direction.material}. Bối cảnh {argument name="bối cảnh" default="khu đô thị Việt Nam hiện đại"}; ánh sáng ${direction.light}; góc nhìn {argument name="camera" default="eye-level 28mm, vertical lines thẳng"}. Tạo phối cảnh photorealistic giàu chiều sâu, vật liệu PBR đúng tỷ lệ, cảnh quan phù hợp khí hậu; không tự thêm tầng, không đảo gương, không làm sai kết cấu, không chữ, không watermark.`,
  )
}))

const newInteriorPrompts = interiorTypes.flatMap((space, spaceIndex) => interiorDirections.map((direction, directionIndex) => {
  const number = 401 + spaceIndex * interiorDirections.length + directionIndex
  const title = `${space} — ${direction.name}`
  return base(
    title,
    number,
    'Nội thất — Thiết kế chuyên sâu',
    `Thiết kế ${space.toLowerCase()} theo phong cách ${direction.name}, chú trọng công năng, ánh sáng và cảm giác vật liệu.`,
    `Thiết kế ${space.toLowerCase()} theo phong cách ${direction.name}. Giữ nguyên tường, cột, trần, sàn, cửa, cao độ, kích thước thực tế, công năng và camera từ ảnh/mô hình nguồn; bố trí lối đi thông thoáng, ergonomics chính xác, đồ nội thất đúng tỷ lệ và có khả năng thi công. Bảng vật liệu: ${direction.palette}. Tổ chức ${direction.light}, CRI cao, kiểm soát chói và bóng đổ tự nhiên. Điểm nhấn {argument name="điểm nhấn" default="một tác phẩm nghệ thuật tối giản"}; mức trang trí {argument name="trang trí" default="tiết chế"}; ống kính 24mm, vertical lines thẳng, editorial interior photography, photorealistic. Không làm rộng sai không gian, không di chuyển kết cấu, không nhân bản đồ vật, không chữ, không watermark.`,
  )
}))

const vietnamContextTemplates = [
  {
    title: 'Con đường nhỏ nhiều cây xanh và lá vàng rơi',
    desc: 'Con đường nhỏ nhiều cây xanh, vỉa hè, cột đèn đường, con đường ướt nhẹ, một người đàn ông việt nam mặc áo trắng quần trắng thời trang , đang di chuyển, hiệu ứng di chuyển nhẹ, xe máy cổ đậu bên đường, lá vàng rơi.',
    prompt: 'Tạo phối cảnh photorealistic hoặc chuyển ảnh nguồn: con đường nhỏ rợp bóng cây xanh, vỉa hè lát đá tỉ mỉ, cột đèn đường cổ điển, mặt đường hơi ướt nhẹ phản chiếu ánh sáng tự nhiên. Một người đàn ông Việt Nam mặc áo sơ mi trắng quần trắng thời trang đang sải bước với hiệu ứng chuyển động nhẹ (subtle motion blur). Bên lề đường có chiếc xe máy cổ đậu dưới tán cây, những chiếc lá vàng rơi lác đác trên mặt đường. Bối cảnh {argument name="thời điểm" default="buổi chiều thu dịu mát"}, ánh sáng {argument name="ánh sáng" default="nắng xiên ấm áp qua tán lá"}, ống kính 35mm, màu phim cinematic kiến trúc, photorealistic 8K, vertical lines thẳng, không biến dạng, không watermark.',
  },
  {
    title: 'Ngõ nhỏ đặc trưng đô thị tại Việt Nam',
    desc: 'Ngõ nhỏ đặc trưng đô thị tại Việt Nam với nhà phố san sát, ban công hoa rủ, sinh động và ấm cúng.',
    prompt: 'Phối cảnh kiến trúc trong ngõ nhỏ đặc trưng đô thị tại Việt Nam: bề rộng ngõ 3–4m lát gạch hoặc bê tông sạch sẽ, hai bên là nhà phố nhiều tầng với ban công hoa giấy rủ bóng, chậu cây xanh bậc thềm, cửa sổ mở thoáng. Ánh sáng {argument name="ánh sáng" default="nắng sớm xuyên qua khoảng hẹp giữa hai dãy nhà"}, bối cảnh {argument name="thời điểm" default="buổi sáng trong trẻo"}, bầu không khí ấm cúng, chân thực, cinematic, 28mm, photorealistic, không chữ, không watermark.',
  },
  {
    title: 'Con đường nông thôn Bắc Bộ ven đồng lúa và con kênh',
    desc: 'Con đường nông thôn bắc bộ Việt Nam, với hàng cây ven đường, đồng lúa, con kênh.',
    prompt: 'Phối cảnh kiến trúc nông thôn Bắc Bộ Việt Nam: con đường làng phẳng phiu chạy ven dòng kênh nước êm đềm, hai bên rợp bóng hàng cây xà cừ hoặc rặng tre xanh, mở ra cánh đồng lúa xanh mướt trải dài đến tận chân trời. Ánh sáng {argument name="ánh sáng" default="golden hour hoàng hôn ấm áp"}, không gian yên bình, trong lành, phản chiếu mặt nước êm dịu, ống kính 24mm, photorealistic 8K, màu sắc tự nhiên Việt Nam.',
  },
  {
    title: 'Khu đô thị cao cấp Vinhome',
    desc: 'Khu đô thị cao cấp Vinhome chuẩn quốc tế với vỉa hè rộng lát đá, hàng cọ, biệt thự và shophouse sang trọng.',
    prompt: 'Phối cảnh công trình trong khu đô thị cao cấp Vinhome: hạ tầng đồng bộ chuẩn quốc tế với vỉa hè rộng lát đá granite, hàng cọ và cây xanh cắt tỉa hoàn hảo, cột đèn thông minh, xa xa là hồ cảnh quan và tháp căn hộ hiện đại. Ánh sáng {argument name="ánh sáng" default="ban ngày trong xanh với bóng đổ sắc nét"}, vật liệu kiến trúc cao cấp, kính phản quang, nhôm alu, photorealistic 8K, tỉ lệ chuẩn xác.',
  },
  {
    title: 'Đường phố Hà Nội với hàng cây cổ thụ',
    desc: 'Đường phố Hà Nội đặc trưng với vỉa hè lát đá, hàng cây sấu cổ thụ rợp bóng mát và nét kiến trúc thanh lịch.',
    prompt: 'Bối cảnh đường phố Hà Nội: vỉa hè rộng lát đá tự nhiên dưới bóng hàng cây cổ thụ xanh mát, mặt đường asphalt phẳng phiu, kiến trúc xung quanh mang nét giao thoa giữa nét thanh lịch hoài niệm và nhịp sống hiện đại. Ánh sáng {argument name="ánh sáng" default="nắng sớm lọc qua vòm lá"}, không khí thanh bình tinh tế của thủ đô, 28mm, photorealistic, vertical lines thẳng tắp.',
  },
  {
    title: 'Đường phố hiện đại với các vệt đèn xe',
    desc: 'Đường phố hiện đại với các vệt đèn xe chuyển động (light trails), cao ốc lung linh ánh đèn ban đêm.',
    prompt: 'Bối cảnh đường phố đô thị hiện đại về đêm: trục đường lớn với hiệu ứng vệt đèn xe chuyển động (light trails đỏ và trắng đan xen mượt mà), vỉa hè hiện đại lát gạch dẫn hướng, xung quanh là các tòa nhà cao ốc phản chiếu ánh đèn neon và kính curtain wall. Ánh sáng {argument name="ánh sáng" default="đêm đô thị rực rỡ kết hợp blue hour"}, long exposure photography, 24mm, photorealistic, sang trọng và năng động.',
  },
  {
    title: 'Con đường đất sình lầy nhiều vũng nước nhỏ',
    desc: 'Con đường đất sình lầy nhiều vũng nước nhỏ sau mưa, phản chiếu bầu trời, mộc mạc và chân thật.',
    prompt: 'Bối cảnh con đường đất tự nhiên sình lầy mộc mạc: mặt đường đất gồ ghề với những vũng nước nhỏ đọng lại sau cơn mưa phản chiếu bầu trời nhiều mây, ven đường là cỏ dại và cây bụi xanh ướt át. Ánh sáng {argument name="ánh sáng" default="trời âm u khuếch tán sau mưa"}, độ ẩm không khí rõ nét, texture đất ướt và vũng nước chân thực, photorealistic cinematic raw texture.',
  },
  {
    title: 'View sông nước thanh bình',
    desc: 'View sông nước thanh bình, mặt nước phẳng lặng, rặng dừa nước và không gian mở thoáng đãng.',
    prompt: 'Bối cảnh ven sông nước thanh bình: dòng sông rộng phẳng lặng lững lờ trôi, thảm cỏ và rặng dừa nước hoặc cây bản địa ven bờ đung đưa theo gió, mặt nước lấp lánh phản chiếu ánh sáng tự nhiên. Ánh sáng {argument name="ánh sáng" default="bình minh dịu mát hoặc cuối chiều êm ả"}, tầm nhìn thoáng đãng vô tận, mang lại cảm giác thư thái tuyệt đối, 24mm wide angle, photorealistic.',
  },
  {
    title: 'Ven hồ thơ mộng',
    desc: 'Ven hồ thơ mộng với thảm cỏ mịn màng, hàng cây soi bóng nước và sương mờ bảng lảng.',
    prompt: 'Bối cảnh ven hồ thơ mộng: lối đi dạo lát đá uốn lượn ven mép nước, thảm cỏ xanh mịn, hàng cây rủ bóng xuống mặt hồ phẳng lặng như gương soi bóng bầu trời. Ánh sáng {argument name="ánh sáng" default="golden hour huyền ảo"}, sương khói mỏng manh bảng lảng trên mặt nước, không gian tĩnh lặng đầy chất thơ, photorealistic 8K.',
  },
  {
    title: 'Triền dốc Đà Lạt với rừng thông',
    desc: 'Triền dốc Đà Lạt với rừng thông ba lá cao vút, bậc đá thoai thoải và không khí se lạnh cao nguyên.',
    prompt: 'Bối cảnh triền dốc Đà Lạt đặc trưng: công trình nằm thoải theo sườn đồi thoai thoải, bao quanh bởi rừng thông ba lá cao vút reo trong gió, lối đi bậc đá uốn lượn theo địa hình tự nhiên. Ánh sáng {argument name="ánh sáng" default="nắng sớm xuyên qua sương mù và kẽ lá thông (god rays)"}, không khí se lạnh cao nguyên trong trẻo, 28mm, photorealistic kiến trúc nghỉ dưỡng Đà Lạt.',
  },
  {
    title: 'Triền đồi đường đi quanh co thơ mộng, cây xanh',
    desc: 'Triền đồi đường đi quanh co thơ mộng, cây xanh hoa cỏ uốn lượn theo địa hình tự nhiên.',
    prompt: 'Bối cảnh triền đồi với con đường quanh co mềm mại uốn theo sườn núi: hai bên phủ đầy hoa dại và cây xanh rợp bóng, mở ra tầm nhìn xuống thung lũng bao la phía xa. Ánh sáng {argument name="ánh sáng" default="nắng vàng mật cuối chiều"}, đường cong giao thông hòa quyện hoàn hảo vào địa hình tự nhiên, photorealistic 8K, bố cục lớp lang giàu chiều sâu.',
  },
  {
    title: 'Siêu đô thị hiện đại',
    desc: 'Siêu đô thị hiện đại đẳng cấp với các tổ hợp cao ốc chọc trời, cầu cạn đa tầng và mặt dựng kính lộng lẫy.',
    prompt: 'Bối cảnh siêu đô thị hiện đại đẳng cấp thế giới: mạng lưới cao ốc kính và kim loại vươn cao, hệ thống giao thông đa tầng sạch sẽ, lối đi bộ trên cao kết nối các phân khu, cây xanh tích hợp trên mặt đứng (vertical forest). Ánh sáng {argument name="ánh sáng" default="blue hour hiện đại kết hợp chiếu sáng mặt dựng cao cấp"}, 18mm góc siêu rộng, photorealistic hoành tráng.',
  },
  {
    title: 'Khu biệt thự cao cấp',
    desc: 'Khu biệt thự cao cấp khép kín, đường nội khu sạch bóng, vỉa hè cubic và thảm thực vật tỉ mỉ.',
    prompt: 'Bối cảnh khu biệt thự cao cấp khép kín: đường nội bộ rộng rãi rải nhựa asphalt mịn màng không tì vết, vỉa hè lát đá cubic, hai bên là hàng rào cây xanh được cắt tỉa tỉ mỉ, thảm cỏ nhung Nhật và biệt thự lân cận sang trọng đồng điệu. Ánh sáng {argument name="ánh sáng" default="nắng ban mai trong trẻo"}, không gian yên tĩnh, an ninh, xa hoa tiết chế, photorealistic 8K.',
  },
  {
    title: 'Nhà lô phố liền kề 2 bên có các ngôi nhà hàng xóm, vỉa hè, cây xanh đô thị, cột đèn',
    desc: 'Nhà lô phố liền kề 2 bên có các ngôi nhà hàng xóm, vỉa hè, cây xanh đô thị, cột đèn.',
    prompt: 'Bối cảnh nhà lô phố liền kề đặc trưng đô thị Việt Nam: hai bên công trình là các ngôi nhà phố của hàng xóm được thiết kế chỉn chu, mặt đứng đồng đều cao độ, vỉa hè rộng rãi có cây xanh đô thị tạo bóng mát, cột đèn chiếu sáng đồng bộ và đường phố sạch sẽ. Ánh sáng {argument name="ánh sáng" default="ban ngày dịu mát"}, tỷ lệ chuẩn xác và thực tế, 28mm, photorealistic.',
  },
  {
    title: 'Khu quy hoạch dân cư đặc trưng việt nam, một số ngôi nhà đang thi công, một số ngôi nhà đã hoàn thiện, xen kẻ là các lô đất trống, đường xá sạch sẽ',
    desc: 'Khu quy hoạch dân cư đặc trưng việt nam, một số ngôi nhà đang thi công, một số ngôi nhà đã hoàn thiện, xen kẻ là các lô đất trống, đường xá sạch sẽ.',
    prompt: 'Bối cảnh khu quy hoạch dân cư đặc trưng tại Việt Nam: các lô đất phân lô vuông vắn, một số căn nhà phố mới hoàn thiện hiện đại, xen kẽ vài ngôi nhà đang thi công phủ lưới an toàn sạch sẽ và các lô đất trống thảm cỏ xanh, lòng đường bê tông/nhựa rộng rãi phẳng phiu, vỉa hè hoàn chỉnh. Ánh sáng {argument name="ánh sáng" default="nắng ráo ban ngày"}, tính thực tế cao, photorealistic architectural context.',
  },
  {
    title: 'Góc ngã tư khu dân cư',
    desc: 'Góc ngã tư khu dân cư 2 mặt tiền thông thoáng, vỉa hè bo cong và bóng mát cây xanh.',
    prompt: 'Bối cảnh góc ngã tư khu dân cư sầm uất nhưng văn minh: công trình tọa lạc tại vị trí 2 mặt tiền giao lộ, vỉa hè góc cua bo tròn lát đá sạch đẹp, cây xanh tán rộng che bóng mát cho ngã tư, vạch kẻ đường rõ ràng. Ánh sáng {argument name="ánh sáng" default="nắng sớm xiên nhẹ tạo bóng đổ sinh động"}, 24mm góc rộng khoe trọn 2 mặt tiền kiến trúc, photorealistic.',
  },
  {
    title: 'Miền tây sông nước',
    desc: 'Miền tây sông nước trù phú với rặng dừa râm mát, kênh rạch phù sa và cầu gỗ mộc mạc.',
    prompt: 'Bối cảnh miền Tây sông nước trù phú: ngôi nhà nép mình bên dòng kênh/rạch phù sa màu mỡ, hai bên bờ rợp bóng rặng dừa nước xanh ngắt, cầu khỉ hoặc cầu gỗ mộc mạc, xa xa là chiếc xuồng ba lá lững lờ. Ánh sáng {argument name="ánh sáng" default="nắng nhiệt đới rực rỡ chan hòa"}, không khí tươi mát phóng khoáng của vùng đất phương Nam, photorealistic.',
  },
  {
    title: 'Ruộng bậc thang tây bắc Việt nam',
    desc: 'Ruộng bậc thang tây bắc Việt nam kỳ vĩ uốn lượn theo sườn núi, mây trắng vờn quanh đỉnh đèo.',
    prompt: 'Bối cảnh ruộng bậc thang Tây Bắc Việt Nam: công trình tọa lạc trên lưng chừng đồi, nhìn xuống những thửa ruộng bậc thang uốn lượn kỳ vĩ như sóng lúa vàng mùa gặt (hoặc mùa nước đổ lấp lánh như gương), xa xa là dãy núi trập trùng mây phủ. Ánh sáng {argument name="ánh sáng" default="nắng sớm xuyên qua màn sương bồng bềnh"}, khung cảnh tráng lệ, photorealistic 8K.',
  },
  {
    title: 'Khu resort cao cấp ven biển Mỹ Khê, Đà Năng',
    desc: 'Khu resort cao cấp ven biển Mỹ Khê, Đà Nẵng với bãi cát trắng mịn, rặng dừa xanh và sóng êm.',
    prompt: 'Bối cảnh khu nghỉ dưỡng resort cao cấp ven biển Mỹ Khê, Đà Nẵng: công trình hướng trọn ra bãi biển cát trắng mịn màng thoai thoải, hàng dừa cao vút nghiêng mình đón gió biển, làn nước biển xanh ngọc bích phẳng lặng. Ánh sáng {argument name="ánh sáng" default="bình minh trên biển rực rỡ hoặc nắng hè nhiệt đới trong vắt"}, vật liệu gỗ ngoài trời, kính lớn không khung, photorealistic chuẩn 5 sao.',
  },
  {
    title: 'Khu dân cư làng chài Mũi né Việt nam',
    desc: 'Khu dân cư làng chài Mũi né Việt nam bình dị với thuyền thúng sắc màu, cát biển thoai thoải và rặng dừa cong.',
    prompt: 'Bối cảnh khu dân cư làng chài Mũi Né: bờ biển thoai thoải rải rác những chiếc thuyền thúng tròn đầy sắc màu neo đậu, hàng dừa cong vút đón gió biển mặn mòi, những mái nhà ngói đỏ phai màu thời gian xen lẫn nét hiện đại mộc mạc. Ánh sáng {argument name="ánh sáng" default="nắng sớm tinh mơ trên làng chài"}, không khí biển mộc mạc chân thật, photorealistic.',
  },
  {
    title: 'Một con đường tại Việt nam',
    desc: 'Một con đường tại Việt nam thân thuộc, vỉa hè lát gạch, bóng mát cây xanh và nhịp sống đô thị hài hòa.',
    prompt: 'Bối cảnh một con đường điển hình tại Việt Nam: mặt đường nhựa phẳng, vỉa hè lát gạch có vạch kẻ và cây xanh đô thị tán tròn, vài chiếc xe máy lưu thông nhịp nhàng, bóng râm râm mát trải dài. Ánh sáng {argument name="ánh sáng" default="ban ngày tự nhiên dịu mắt"}, không gian chân thực, thân thuộc và đầy sức sống đô thị Việt, 28mm, photorealistic.',
  },
  {
    title: 'Nông thôn bắc bộ Việt Nam',
    desc: 'Nông thôn bắc bộ Việt Nam truyền thống với ao làng, bờ gạch rêu phong và vườn cây trĩu quả.',
    prompt: 'Bối cảnh nông thôn Bắc Bộ Việt Nam: con đường lát gạch nghiêng cổ truyền uốn lượn quanh ao làng trong vắt có hoa súng, tường bao xây gạch đất nung rêu phong, hàng rào râm bụt và giàn mướp xanh mướt. Ánh sáng {argument name="ánh sáng" default="nắng vàng ươm buổi chiều thôn dã"}, nét đẹp hoài niệm, bình dị và sâu lắng, photorealistic.',
  },
  {
    title: 'Tây Nguyên, Việt Nam',
    desc: 'Tây Nguyên, Việt Nam với đất đỏ bazan bạt ngàn, đồi cà phê xanh mướt và nắng gió đại ngàn.',
    prompt: 'Bối cảnh vùng đất Tây Nguyên Việt Nam: công trình hòa mình vào địa hình đồi đất đỏ bazan đặc trưng, bao quanh bởi những đồi cà phê xanh mướt ngút ngàn, hàng rào gỗ mộc và rặng hoa dã quỳ vàng rực rỡ. Ánh sáng {argument name="ánh sáng" default="nắng gió đại ngàn rực rỡ, trời xanh thẳm"}, cảm giác tự do, mộc mạc và khoáng đạt, photorealistic 8K.',
  },
  {
    title: 'Phố cỗ Hội An',
    desc: 'Phố cỗ Hội An với bức tường vàng hoàng yến rêu phong, mái ngói âm dương và lồng đèn rực rỡ.',
    prompt: 'Bối cảnh phố cổ Hội An: con phố nhỏ lát đá cổ kính, những bức tường màu vàng hoàng yến đặc trưng rêu phong theo thời gian, giàn hoa giấy rực rỡ nở hoa bên ban công gỗ, mái ngói âm dương cong nhẹ và đèn lồng lụa treo cao. Ánh sáng {argument name="ánh sáng" default="hoàng hôn ấm áp chuyển dần sang đêm đèn lồng huyền ảo"}, photorealistic cinematic, đậm chất di sản văn hóa.',
  },
  {
    title: 'Phố cổ Bao Vinh, Huế, Việt Nam',
    desc: 'Phố cổ Bao Vinh, Huế, Việt Nam trầm mặc bên dòng sông Hương, nhà rường cổ kính và bậc đá rêu phong.',
    prompt: 'Bối cảnh khu phố cổ Bao Vinh - Huế: những ngôi nhà rường cổ mái ngói liệt trầm tư nép mình bên dòng sông Hương thơ mộng, bậc đá tam cấp dẫn xuống bến sông rợp bóng cây cổ thụ, không khí tĩnh mịch và sâu lắng xứ cố đô. Ánh sáng {argument name="ánh sáng" default="mưa phùn nhẹ xứ Huế hoặc nắng chiều bảng lảng"}, vẻ đẹp tao nhã hoài niệm, 35mm, photorealistic.',
  },
  {
    title: 'Sapa Việt Nam',
    desc: 'Sapa Việt Nam bảng lảng sương mù, thung lũng mây trắng bồng bềnh và núi non Hoàng Liên Sơn trùng điệp.',
    prompt: 'Bối cảnh vùng núi Sapa Việt Nam: công trình ngự trên sườn đồi cao nhìn thẳng ra thung lũng Mường Hoa chìm trong biển mây bồng bềnh, xa xa là rặng núi Hoàng Liên Sơn hùng vĩ, ruộng bậc thang tầng tầng lớp lớp. Ánh sáng {argument name="ánh sáng" default="sương sớm mờ ảo lấp lánh nắng mai"}, khí hậu mát lạnh tinh khiết, photorealistic cảnh quan vùng cao.',
  },
  {
    title: 'Cao nguyên đá Đồng Văn',
    desc: 'Cao nguyên đá Đồng Văn - Hà Giang hùng tráng với đá tai mèo xám, đường đèo uốn lượn và nhà trình tường mộc mạc.',
    prompt: 'Bối cảnh cao nguyên đá Đồng Văn - Hà Giang: địa hình đá vôi xám tai mèo trùng điệp kỳ vĩ, con đường đèo uốn lượn như dải lụa xẻ qua núi đá, xen lẫn những nếp nhà trình tường đất ấm áp và hàng rào đá xếp tay tỉ mỉ. Ánh sáng {argument name="ánh sáng" default="nắng gắt tạo bóng đổ tương phản mạnh trên khối đá"}, hùng tráng, gai góc và chân thực tuyệt đối, photorealistic.',
  },
  {
    title: 'Phố đi bộ',
    desc: 'Phố đi bộ đô thị lát đá hoa cương phẳng phiu, không gian công cộng văn minh, cây xanh và ghế nghỉ.',
    prompt: 'Bối cảnh phố đi bộ đô thị trung tâm: toàn bộ mặt đường lát đá granite sạch bóng không vết xe máy ô tô, bồn cây xanh kết hợp ghế ngồi công cộng hiện đại, hệ thống chiếu sáng đô thị tinh tế, người đi bộ tản bộ văn minh thư thái. Ánh sáng {argument name="ánh sáng" default="cuối chiều hoặc đèn đêm lung linh"}, không gian mở đẳng cấp cộng đồng, 24mm, photorealistic.',
  },
  {
    title: 'Khuôn viên Biệt thự sân vườn và tiểu cảnh',
    desc: 'Khuôn viên Biệt thự sân vườn và tiểu cảnh với thảm cỏ xanh mướt, hồ nước tràn viền và lối dạo bước phiến đá.',
    prompt: 'Bối cảnh khuôn viên sân vườn biệt thự cao cấp: thảm cỏ xanh mướt được chăm sóc tỉ mỉ, hồ nước tràn viền với tiểu cảnh đá tự nhiên và tiếng nước chảy róc rách, lối dạo bước bằng đá phiến tự nhiên, cây xanh bố trí theo phân tầng bóng mát, cây bụi và hoa nở rực rỡ. Ánh sáng {argument name="ánh sáng" default="nắng ban mai xuyên qua giọt sương trên lá"}, sang trọng và gần gũi thiên nhiên, photorealistic 8K.',
  },
  {
    title: 'Khuôn viên vườn Nhật với bonsai, hồ cá Koi',
    desc: 'Khuôn viên vườn Nhật với bonsai, hồ cá Koi trong vắt, đèn đá cổ truyền và sỏi trắng cào vân thiền định.',
    prompt: 'Bối cảnh khuôn viên vườn Nhật (Japanese Garden): hồ cá Koi trong vắt với đàn cá bơi lội, kè đá suối tự nhiên, cây tùng la hán và bonsai uốn thế công phu, đèn đá cổ truyền, rải sỏi trắng cào vân sóng thiền định. Ánh sáng {argument name="ánh sáng" default="ánh sáng ban ngày tĩnh tại, thanh tịnh"}, mang đậm triết lý Wabi-Sabi tinh tế, photorealistic.',
  },
  {
    title: 'Khuôn viên sân vươn truyền thống nông thôn bắc bộ Việt nam',
    desc: 'Khuôn viên sân vươn truyền thống nông thôn bắc bộ Việt nam với sân gạch đỏ, hàng cau thẳng tắp và bể nước mưa.',
    prompt: 'Bối cảnh sân vườn truyền thống nông thôn Bắc Bộ: khoảng sân rộng lát gạch nung đỏ au phơi nắng, hàng cau thẳng tắp vươn cao trước sân, giàn trầu không xanh mướt cạnh bể nước mưa có gáo dừa mộc mạc, cây bưởi trĩu quả tỏa hương ngát. Ánh sáng {argument name="ánh sáng" default="nắng trưa hiền hòa hoặc nắng sớm tinh mơ"}, bình yên thuần khiết làng quê Việt, photorealistic.',
  },
  {
    title: 'Khuôn viên sân vườn biệt thự 1 tầng  tại Việt nam',
    desc: 'Khuôn viên sân vườn biệt thự 1 tầng tại Việt nam với hiên rộng trải dài, thảm cỏ thoáng đãng và hồ bơi thư giãn.',
    prompt: 'Bối cảnh khuôn viên sân vườn biệt thự vườn 1 tầng tại Việt Nam: không gian mở trải rộng theo chiều ngang, hiên nhà rộng rãi kết nối liền mạch với thảm cỏ xanh bát ngát, lối đi rải sỏi và cây ăn trái nhiệt đới, bể bơi xanh biếc hoặc góc uống trà thư giãn ngoài trời. Ánh sáng {argument name="ánh sáng" default="nắng dịu ban ngày chan hòa gió mát"}, 24mm wide view, photorealistic.',
  },
  {
    title: 'Khuôn viên nhà vườn kiểu làng quê Việt Nam',
    desc: 'Khuôn viên nhà vườn kiểu làng quê Việt Nam với vườn rau xanh, luống hoa bản địa và ao sen thanh mát.',
    prompt: 'Bối cảnh khuôn viên nhà vườn làng quê Việt Nam: vườn rau xanh mướt chia luống ngay ngắn, ao sen/ao cá nhỏ nước trong vắt râm mát bóng tre xanh, lối đi đất nện sạch sẽ viền cỏ hoa sam hoa mười giờ rực rỡ, không gian đậm chất nghỉ dưỡng tái tạo năng lượng. Ánh sáng {argument name="ánh sáng" default="nắng ấm tự nhiên"}, mộc mạc, thư thái tuyệt đối, photorealistic.',
  },
  {
    title: 'Một con đường tại Việt Nam yện bình nhiều cây xanh, bóng mát, vỉa hè hiện đại',
    desc: 'Một con đường tại Việt Nam yên bình nhiều cây xanh, bóng mát, vỉa hè hiện đại lát đá sạch đẹp.',
    prompt: 'Bối cảnh một con đường tại Việt Nam yên bình nhiều cây xanh: hai bên đường là hàng cây xà cừ hoặc giáng hương tán rộng tỏa bóng mát rượi trùm kín lòng đường, vỉa hè hiện đại lát đá granit phẳng phiu, sạch sẽ không rác, vài chiếc xe đạp hoặc người đi bộ thư thả. Ánh sáng {argument name="ánh sáng" default="nắng đốm hoa xuyên qua vòm lá rợp bóng mát"}, mang đến cảm giác thanh thản, trong lành, photorealistic 8K.',
  },
  {
    title: 'Một con đường làng quê Việt Nam với 2 hàng cây ven đường, xa xa là cánh đồng và núi non thơ mộng',
    desc: 'Một con đường làng quê Việt Nam với 2 hàng cây ven đường, xa xa là cánh đồng và núi non thơ mộng.',
    prompt: 'Bối cảnh con đường làng quê Việt Nam: con đường thẳng tắp chạy dài với hai hàng cây xanh mát rượi đứng đều hai bên bờ, mở rộng tầm mắt ra hai bên là cánh đồng lúa xanh mướt thẳng cánh cò bay, phía chân trời xa xa là những dãy núi non trùng điệp mờ ảo trong sương. Ánh sáng {argument name="ánh sáng" default="bình minh rạng rỡ hoặc hoàng hôn nhuộm vàng cánh đồng"}, khung cảnh bao la, nên thơ và tráng lệ, photorealistic 8K.',
  },
]

const vietnamContextPrompts = vietnamContextTemplates.map((item, index) =>
  base(item.title, 501 + index, 'Cảnh quan & Bối cảnh', item.desc, item.prompt)
)

export const additionalPrompts: PromptItem[] = [
  ...architecturePrompts,
  ...interiorPrompts,
  ...editPrompts,
  ...newArchitecturePrompts,
  ...newInteriorPrompts,
  ...vietnamContextPrompts,
]
