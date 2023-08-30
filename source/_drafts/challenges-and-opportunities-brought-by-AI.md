---
title: 人工智能、经济危机、隐私和我们
date: 2023-08-26 16:10:55
categories: 随笔
tags:
  - AI
---

注：本文不会涉及任何算法，只通俗地分享自己的感悟，若有事实错误请直接批评指正，感谢大家。

# 0. 序

最近深度体验了 AI 绘图 Stable Diffusion，结合正在发生的经济危机/裁员/通缩，我产生了一些思考：AI 大模型时代的到来，到底会淘汰哪些人？哪些领域会受到影响？AI 带来哪些隐私、道德和安全问题？作为受到直接影响的底层程序员/设计师/画师/写手，我们真的只能坐以待毙吗？

我的结论是：第三产业大部分领域都会受到影响 (实业产业影响较小)。

> 第一产业是指农、林、牧、渔业。
>
> 第二产业是指采矿业，制造业，电力、燃气及水的生产和供应业，建筑业。
>
> 第三产业是指除第一、二产业以外的其他行业。第三产业包括：交通运输、仓储和邮政业，信息传输、计算机服务和软件业，批发和零售业，住宿和餐饮业，金融业，房地产业，租赁和商务服务业，科学研究、技术服务和地质勘查业，水利、环境和公共设施管理业，居民服务和其他服务业，教育，卫生、社会保障和社会福利业，文化、体育和娱乐业，公共管理和社会组织，国际组织。

# 1. AI 绘图现在发展到什么程度了？

其实半年前（2023年3月左右）我就接触了 Stable Diffusion (一个开源的 AI 绘图项目)，那时候基于扩散模型的 AI 绘图才刚发展起来，对我有一定的冲击，毕竟这种通过文字转化为图像的方式是革命性的。
但受限于显卡，只画了一些简单的内容，画出来的人也是比较挫。

<figure>
  <img width="360" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/sd1.5model.jpg">
  <figcaption style="font-style: italic">早期的 AI 绘图模型 (来自 Stable Diffusion 1.5 大模型)</figcaption>
</figure>


随着时间推移，各种 Chat 类应用，Code 补全类的 AI 工具层出不穷，我意识到 AI 时代已经来临，于是向老婆申请购买了一张二手的 3090 显卡，这张卡的优势在于有 24G 大显存，玩过 AI 绘图的小伙伴应该知道，显存越大，能画出来的原始图像分辨率就越高，训练时每一次迭代也可以同时训练更多图像。

拿到显卡后，我就陆续开始了对 AI 绘图的探索，先是沉溺与画各种漂亮妹子，然后绘制各种风格的图像，比如幻想风格、像素画风、游戏素材等图像。

<figure>
  <img width="360" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/majicmixRealistic.jpeg" alt="真实系漂亮妹子">
  <figcaption style="font-style: italic">真实系风格 (来自 majicmix realistic 大模型)</figcaption>
</figure>

<figure>
  <img width="360" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/majicmixLux.jpeg">
  <figcaption style="font-style: italic">奇幻风格 (来自 majicmix lux 大模型)</figcaption>
</figure>

<figure>
  <img width="360" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/pixelArt.jpeg">
  <figcaption style="font-style: italic">像素风格 (来自 Pixel Art LoRa 模型)</figcaption>
</figure>

<figure>
  <img width="640" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/game-resource.jpg">
  <figcaption style="font-style: italic">游戏素材 (左：Game Icon Research LoRa 模型 / 右：Character Design Sheet LoRa 模型)</figcaption>
</figure>

后来不满足于画各种乱七八糟的东西，开始去各大网站搜罗 SD 应用方面的教程，陆续学习了照片高清放大、照片动漫化、AI 艺术字、光影重绘、换脸换装等各种应用。

<figure>
  <img width="640" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/upscale.jpg">
  <figcaption style="font-style: italic">AI 高清放大 (SD 高清重绘)</figcaption>
</figure>

<figure>
  <img width="" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/repaint-disney.jpg">
  <figcaption style="font-style: italic">真人转动漫风格 (Disney 大模型重绘)</figcaption>
</figure>

<figure>
  <img width="480" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/ai-art-font.jpg">
  <figcaption style="font-style: italic">AI 艺术字 (ControlNet Tile 模型)</figcaption>
</figure>

<figure>
  <img width="640" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/change-light.jpg">
  <figcaption style="font-style: italic">光影重绘 (ControlNet Tile 模型)</figcaption>
</figure>

再后来又用爱人的照片做数据集，训练她自己的真人模型，效果也相当不错，她本人看到都惊叹于其相似度。

<!-- more -->

<figure>
  <img width="720" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/repaint.jpg">
  <figcaption style="font-style: italic">用自训练的 LoRa 模型重绘网络图片 (已征得爱人同意)</figcaption>
</figure>

这也算是将爱人美好的青春永驻在硬盘里了，哈哈哈。

OK, 这里只是简单介绍一下 AI 绘图，就不占用过多篇幅了，以后有空再聊聊 AI 绘图的各种应用。

# 2. AI 辅助编程对于软件开发行业的冲击

与此同时，无论工作中还是休闲放松时做做开源应用，我都会使用 AI 辅助编程工具，比如早期的 Tabnine、Kite 等，后来又陆续尝试了 GitHub Copilot、JetBrains AI Assistant 等工具。
接触到 AI 辅助编程工具后，第一时间是惊奇，“太厉害了” “以后还要我们干啥” 这种言论充斥着整个同事圈。

<figure>
  <img width="720" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/code-ai-assistant.jpg">
  <figcaption style="font-style: italic">AI 辅助编程</figcaption>
</figure>


但随着深入的使用后，发现这种工具还是有一定局限性。比如它只能按照已有的轮子生成新的轮子，如果你让他解决业务问题，或者是互联网上很难搜到的内容，它也无能为力（当然未来会通过上下文接入需求看板来解决这个问题），有时候还会胡乱回答。

<figure>
  <img width="420" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/ai-reply-casually.jpg">
  <figcaption style="font-style: italic">ChatGPT 一本正经的胡说八道</figcaption>
</figure>

所以现阶段我们只能将 AI 辅助编程工具当做一个代码片段生成器，在写一些工具方法、解决算法问题或者是写一些简单的业务逻辑时，AI 辅助编程工具还是很有用的，能很大的节约人工成本。
以往我们都是靠自己的经验手敲或者去网上搜，现在只需要输入几个关键词，AI 就能帮我们生成代码片段，这样我们就能将更多的精力放在业务逻辑上，而不是在写代码上。

其实人工智能这个概念并不是近几年才被提出的，早在十几年前我们就已经生活在 AI 的时代了，比如我们常用的人脸(图像)识别、语音识别、聊天机器人、翻译机器人等，这些都是 AI 服务，甚至早在上个世纪就有一些简单的 AI 应用。

那为什么今年上半年 AI 又突然破圈火爆起来了呢？这就要提到以 OpenAI 公司的 GPT-3.5 大语言模型为基础的首个应用 ChatGPT 公开了。

# 3. 大语言模型时代

GPT-3 是一个 1750 亿参数的大语言模型 (LLM, Large Language Model)，通过聊天的形式将人工智能展现出来，破圈而出进入到大众人的视野中。它的出现刷新了人们对于人工智能的看法，也让人们见识到了人工智能的巨大发展潜力。

随后，各大公司纷纷开始研发大语言模型应用，比如百度的文心一言、阿里的通义千问、微软的 New Bing、Google 的 Bard 等等，背后大模型的参数量也是一个比一个夸张。

<figure>
  <img width="640" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/llm.jpg">
  <figcaption style="font-style: italic">雨后春笋般的大语言模型 (网图)</figcaption>
</figure>

为什么这些大模型如雨后春笋般的冒出来？**正是因为 OpenAI 证明了大语言模型这条路子是可行的**，而且效果显著，大家有了着力点，所以各大公司都开始研发大语言模型，希望能够在各自的领域占据一席之地。

**大语言模型的出现，让整个 AI 生态有了质的改变。** 如果说图像识别是 AI 的眼睛，语音识别是耳朵，语音合成是嘴巴，散落在各地的各式传感器是触觉，新一代通信技术是神经系统，大数据时代海量的数据是书籍，那么大语言模型就是大脑，它通过各种 AI 技术获取到的信息，进行提取、分析、决策，最终输出结果。

> “人之所以比动物聪明，正是因为有了书籍，人类将其毕生所学记录下来，让后人能够少走弯路，不断积累，最终形成了今天的人类文明。 ”
> —— 忘了谁说的

随之产生一类基于大语言模型的自动化应用，比如 Auto-GPT，这类应用理论上可以做到**几句话生成一个网站**：

1. 通过你提供的几句话或关键字，利用 AI 绘图 + Web 开发相关的绘图模型，生成网站效果图
2. 然后通过你提供的几句话需求和效果图，生成具体的需求文档
3. 根据需求文档自动生成相应的测试用例
4. 根据测试用例和需求文档自动生成相应的代码
5. 自动执行测试，根据失败的测试自动修复 BUG 和重构代码
6. 自动上云部署，最终生成一个完整可用的网站。

<figure>
  <img width="480" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/auto-gpt-workflow.jpg">
  <figcaption style="font-style: italic">Auto-GPT Workflow</figcaption>
</figure>

在这期间，人类需要做的就是说出自己的需求并从 AI 生成的效果图和需求文档中进行微调，然后就是堆算力等时间，只要有足够计算资源，结合大模型做到这件事并不难。


# 4. 辐射

> 这里的辐射不是指日本核污水排海

随着第一批受到直接影响的行业（软件开发、写作、设计领域），AI 大模型带来的影响会逐渐**辐射**到各个行业，比如金融、教育、法律、医疗、影视、游戏等等。
所以不止软件开发领域能吃到这口“山芋”，其他垂直领域也可训练自己的小模型，比如

- 法律行业：大数据时代海量的法律案例结合当下的各种法律文件，训练出法律模型，通过输入当事人的信息，就可以自动生成相应的法律文书，从而降低律师的工作量，提高效率。
- 医疗行业：海量的病例、图纸、药品、病毒、细菌等数据结合当下的各种医疗文件，训练出医疗模型，通过输入病人的信息，就可以自动生成相应的诊断报告、药方、手术方案等，从而降低医生的工作量，提高效率。
- 金融行业：海量的金融数据被背景，训练出金融模型，通过输入公司的财务数据或投资倾向，就可以自动生成相应的投资方向和财务分析报表，从而降低公司运营风险和寻找可能的着力点。
- 公共运输：根据城市地图、人才密度和流动性，训练出公共运输模型，配合智能交通系统，可以让消防救援车辆一路绿灯，规划最优行驶路线。
- 教育行业：这点更不用说，训练出适合年龄段和领域的教育模型后，配合个人的能力水平及学习水平，自动生成相应的互动式的学习资料，做到一对一针对性的教学。


# 5. 经济危机

随着各种大模型的入局，被先后影响的各行各业、前几年 Covid-19 席卷全球、各国政治斗争等客观因素造成经济低迷，导致软件服务业、设计行业等职业需求量大幅下降，各公司裁员，缩减招聘规模，甚至很多中小型企业倒闭。

在这个过程中，那些繁琐但有规律的工作会被 AI 代替，以前需要10个人干活，现在只需要6个人就能完成，造成工作岗位的减少，从而导致失业率的上升。失业率上升后，人们的消费能力会下降，从而导致经济的低迷，人们更不愿意将自己的钱花出去而是存起来，进而导致通过紧缩。

> 通货紧缩是指市场上流通的货币减少，货币的价值升高，商品及劳务价格总水平持续下跌。 在通货紧缩时期，由于流通货币的减少造成社会购买力下降，通常会引起商品和服务的平均价格水平下跌，形成价格通缩。 价格下跌对消费者来说看似是个好消息，但是通货紧缩会抑制投资与生产，造成经济衰退，引起失业、工资下降及房地产和股票市场的下跌。

<figure>
  <img width="360" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/stocks-down.jpg">
  <figcaption style="font-style: italic">市场低迷 (NVDA: <span style="font-style: normal;">🤭</span>)</figcaption>
</figure>

> 小科普：NVDA (Nvidia, 英伟达) 是生产显卡的厂商，显卡是 AI 训练的重要硬件，得益于 Nvidia CUDA 框架，Nvidia 显卡在 AI 训练领域占据了绝对的优势，所以 NVIDIA: 🤭

而 AI 带来的挑战和影响还不止这些...

# 6. 隐私、道德与安全

作为企业或个人，你没有足够的资源训练属于自己的模型，使用第三方平台提供的“免费资源”，你无形的就将属于自己/企业的数据轻松并无偿的提供给了他人。你获得了你想要的，他们也获取到了他们想要的。
这看似是一种双赢的局面，实则是一种隐形的“剥削”，你的数据被他人利用，而你却毫无察觉。

> 剥削：原指一种工人和雇主之间财产、权力不对等基础的剥削关系。这里指拥有海量资源的大公司和个体用户之间的信息不对等关系。

AI 大模型的训练需要大量的数据，而这些数据往往是用户的隐私数据，比如你的照片、视频、语音、文字、位置、健康数据等等，这些数据都是你的隐私，但是你却不知道它们被用来训练 AI 模型了。

如果有若干你的照片，就可以通过绘图模型训练全方位高清的你的 3D 模型，进而制作你的任何图片、视频；

如果获得几句话你的语音，就可以通过语音合成模型提取你的声纹特征，即可用你的声音说出任何话；

如果有了你的位置数据，就可以自由的生成你通常的活动路线和所处地段，进而了解你的收入水平和资产实力；

<figure>
  <img width="640" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/VALL-E-X.jpg">
  <figcaption style="font-style: italic">VALL-E X - 只需要你说一句话，就可以生成你的声纹模型</figcaption>
</figure>

<figure>
  <img width="640" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/faceswap.jpg">
  <figcaption style="font-style: italic">DeepFace Live 实时换脸 (网图)</figcaption>
</figure>


暂停一下，问个问题：如果是你，拥有了这些数据和技术，你会做什么？

展开想想，你是否感受到了一丝恐惧？

不法分子可以利用你发在朋友圈的照片，制作不雅照片进行传播获利；  
利用你发在短视频平台中的视频和语音，对你进行声纹采样，结合实时换脸技术合成视频，来敲诈你的亲人或朋友；  
如果你身价够高的话，利用你的位置数据，制作你的活动路线，进而推测出你的收入、消费水平，然后在你不知情的情况下，将你的位置信息出售给不法分子，让他们对你进行跟踪、敲诈甚至绑架等等行为。

虽然现在各大网站都在呼吁道德问题，抵制 AI 等声音也络绎不绝，但这个问题并不能够一刀切，为什么呢？  
一方面如果所有相关技术和学习资料都被明面上禁止，那么 AI 资源就会掌握在少数的几个国家或企业手中，未来的世界就会变成一个极权主义的世界；
另一方面，这些技术也不会因为禁止而消失，只会变得更加隐蔽，更加危险。


看完这些，你以后是否不敢在朋友圈或是短视频平台发自己的照片和视频了呢？杜绝各式各样的人脸采集系统？出门裹一个黑色面巾？语音通话要压着嗓子说？

作为普通民众的我们，就只能成为待宰的羔羊了吗？


# 7. 思考

近半年来我不断思考和怀疑自己，曾经拼搏和追求的技术卓越，在人工智能时代还有这个必要吗？经济危机下的我，是不是应该转行实业学个手艺做水暖电工？

第一次工业革命，以蒸汽机的出现为标志，生产工具发生了**由手工形态向机器形态的质变**，人类社会开始走向机械化时代，“解放”了大部分传统手工业者，但也带来较高的生产效率，从而降低了商品的价格。

第二次工业革命，以内燃机和电力的出现为标志，使得**大规模化生产成为了主导性的生产方式**，又“解放”了一群人，也大大降低的生产成本和和效率，使得我们能够轻而易举的用到各种塑料制品、电子产品、汽车等等，提高了人类的生活平均水平。

第三次工业革命，以计算机的出现为标志，使得人类进入了信息时代，人类的生产方式再次发生了质变，从以前的**机械化生产方式，变成了信息自动化生产方式**，人类的生产效率大大提高，也代替了人类进行一定程度的脑力劳动，同时又“解放”了一群人。使得我们的物质生活和精神生活达到了前所未有的高度。

<figure>
  <img width="640" src="https://static.mutoe.com/2023/challenges-and-opportunities-with-ai/industrial-revolution.jpg">
  <figcaption style="font-style: italic">前三次工业革命和正在进行的人工智能革命</figcaption>
</figure>


大语言模型的入局，也会带来新一轮人工智能革命。可以预见的是，它将解放大部分的脑力劳动，也会“解放”一群人。

虽然作为可能被解放的人，但也不能因此就放弃对生活的热情。我们不能只看到 AI 带来的挑战，也要看到 AI 带来的机遇，即便是**现在的我们，又何尝没有享受信息革命带来的红利呢？**“高薪”的程序员、律师、设计师等，不就是信息革命的产物吗？

仔细观察，解放的这一群人，都是那些有高度可替代性基层人民和基础工作，会解放解放企业家和资本家吗？

企业家、资本家他们有什么能力是 AI 无法完成的？正是那些具有不可预测性的创造性工作和商业投资决策能力，这些都是 AI 无法完成的，所以他们不会被 AI 解放，反而会因为 AI 的出现而获得更多的利益。

容易联想，我们也能从人工智能革命中受益，比如

- 软件开发领域，初级程序员可以通过大语言模型快速上手软件开发，从而降低软件开发的门槛，提高效率。行外人也能为此得到更低廉的软件开发服务，让更多人享受到软件带来的便利（虽然它损害了软件开发行业的利益😭）；
- 法律行业律师的门槛也会降低；普通民众的我们甚至不再需要请律师（虽然它可能损害了法律行业的利益）
- 医疗领域，AI 的介入可以让原本不足的医疗资源得到缓解，通过 AI 辅助诊疗，帮助医生快速推测病因从而提高诊疗质量和效率；
- 影视、游戏行业也可利用 AI 生成各种场景、角色、剧本等，从而降低成本提高效率，让我们体验到更多好玩的游戏和看到更多高质量的大片。
- 或许会诞生新的职业，比如信息中介，通过不会使用 AI 的人和会使用 AI 的人之间的信息不对等，从而赚取差价。
- 找机会投资、创业，凭借毒辣的眼光入局 AI，成为下一代资本家...(或者倾家荡产😂)

我想，被 AI 淘汰的并不是身处一线的程序员、设计师、画师、写手、律师等职业，而是那些**不愿意学习、适应、改变**的人。

另外，就在这个月，北京市卫健委也出台了互联网诊疗监管相关的政策，要求医生出诊前必须进行实名认证，不能由人工智能软件代替行医，严禁使用人工智能自动生成处方。
是的，AI 的出现确实会对医疗行业带来一定的帮助，但是 AI 也不是万能的，现阶段会出现不懂装懂以假乱真的情况，所以它只能辅助医生进行诊疗，而不能完全替代医生，毕竟生命无小事。

关于安全问题是亘古不变永恒的话题，AI 是一把双刃剑，虽然它再某些方面能使我们的生活更加便利，但也要擦亮眼睛，多留个心眼。无论是 AI 生成的内容，还是互联网上传播的各种信息，不要轻易相信，多思考，多判断，多验证。

如果不幸你的照片或者声音被不法分子利用，我认为也不用太担心。AI 未来常态化后，大部分人都会对不寻常的事情保持警惕，不会轻易相信，这样不法分子就很难获得利益，从而减少了不法分子的行为。你需要做的就是加速这个过程，让自己的亲人、朋友都了解到现在的高科技犯罪手段，提高警惕，做到不相信、不打款、不转发。

# 8. 后话

胡言乱语一番，不是为了贩卖焦虑，只是为了让大家在这个经济低迷的时代，不要放弃对生活的热情。想起和好友雨哥(Yu Wang)闲聊时他曾说过：“在AI的时代，**我们虽然吃不到肉，但是汤还是能喝点的。**”  
我感觉这句话对我还是影响不小，深刻思考了这句话，我没有以前那么焦虑了，我认为不光是 AI 领域，所有领域都是一样的，只要你有毅力，保持对生活的热情，想喝口汤还是有很多机会的。

聪明的你，看看能做点什么？抓住风口浪尖，成为革命后的资本家(不是🤐)。

如果实在不知道干什么，没有想法，还是焦虑，那么趁现在锻炼锻炼身体也是好的，让子弹飞一会儿~

# 参考资料：

- [CompVis/Stable Diffusion - GitHub](https://github.com/CompVis/stable-diffusion)
- [万字科普GPT4为何会颠覆现有工作流 - Bilibili YJango](https://www.bilibili.com/video/BV1MY4y1R7EN)
- [Auto-GPT & AgentGPT: The Groundbreaking AI Innovations You Need to Know - Sebastian](https://medium.com/codingthesmartway-com-blog/auto-gpt-agentgpt-the-groundbreaking-ai-innovations-you-need-to-know-cc7820463d4b)
- [失业率：中国停止发布青年失业数据，今年以来屡创历史新高 - BBC](https://www.bbc.com/zhongwen/simp/chinese-news-66506966)
- [人工智能应用中的安全、隐私和伦理挑战及应对思考 - 科技导报](http://html.rhhz.net/kjdb/20171504.htm)
- [AI换脸骗局背后：AI实时换脸技术 百元左右随意买卖 - 中国新闻网](https://www.chinanews.com.cn/sh/2023/07-12/10041346.shtml)
- [仅需3秒音频实现声音克隆！我开源了微软的最新语音合成模型VALL-E X - Bilibili 茳氵茗 ](https://www.bilibili.com/video/BV1Dh4y1K7qJ)
- [禁止AI处方！AI再能，也不能坐堂行医 - 北京日报](https://bj.bjd.com.cn/5b165687a010550e5ddc0e6a/contentShare/5e799028e4b0f99f4df7a04e/AP64e5eb5ae4b00547e3ddc64f.html)
- [第二次工业革命 - Wikipedia](https://zh.wikipedia.org/zh-sg/%E7%AC%AC%E4%BA%8C%E6%AC%A1%E5%B7%A5%E4%B8%9A%E9%9D%A9%E5%91%BD)
- [奇点将至：AI或开启新一轮科技革命 - 李迅雷、张文宇](https://www.yicai.com/news/101732748.html)
